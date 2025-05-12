"""
Congress Scraper using Playwright to bypass Cloudflare protection and scrape AI-related bills from Congress.gov.
"""

import logging
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Optional, Set
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from .base import BaseScraper
from ..utils.config import CongressScraperConfig

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CongressScraper(BaseScraper):
    def __init__(self, config: Optional[CongressScraperConfig] = None):
        super().__init__(config or CongressScraperConfig())
        self.results = []
        self.processed_urls = set()
        self.timeout = 30000  # 30 seconds timeout
        self.query = self.config.SEARCH_TERM or "artificial intelligence"
        self.base_url = "https://www.congress.gov/search"

    def is_relevant(self, title: str, summary: str) -> bool:
        text = f"{title.lower()} {summary.lower()}"
        keywords = [
            "artificial intelligence", "machine learning", "ai governance",
            "neural network", "automated decision", "foundation model",
            "deep learning", "facial recognition", "algorithmic accountability"
        ]
        return any(k in text for k in keywords)

    def search_bills(self) -> List[Dict]:
        results = []
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                )
                page = context.new_page()

                # Set default timeout
                page.set_default_timeout(self.timeout)

                query_param = json.dumps({"source": "legislation", "search": self.query})
                url = f"{self.base_url}?q={query_param}"
                logger.info(f"Navigating to: {url}")
                
                try:
                    # Navigate to the page
                    page.goto(url)
                    logger.info("Waiting for page load...")
                    
                    # Wait for either the results list or a potential error message
                    page.wait_for_selector("ol.basic-search-results-lists > li, .no-results-message", timeout=self.timeout)
                    logger.info("Page loaded successfully")

                    # Check if we have results
                    if page.query_selector(".no-results-message"):
                        logger.warning("No results found")
                        return results

                    while True:
                        logger.debug("Processing page")
                        items = page.query_selector_all("ol.basic-search-results-lists > li")
                        logger.info(f"Found {len(items)} results on this page")

                        for item in items:
                            try:
                                title_tag = item.query_selector(".result-heading a")
                                summary_tag = item.query_selector(".result-title")

                                if not title_tag:
                                    continue

                                title = title_tag.inner_text().strip()
                                url = title_tag.get_attribute("href")
                                # Add /text to the URL before the query parameters
                                if '?' in url:
                                    base_url, query = url.split('?', 1)
                                    full_url = f"https://www.congress.gov{base_url}/text?{query}"
                                else:
                                    full_url = f"https://www.congress.gov{url}/text"
                                
                                # Skip if we've already processed this URL
                                if full_url in self.processed_urls:
                                    continue
                                self.processed_urls.add(full_url)

                                summary = summary_tag.inner_text().strip() if summary_tag else ""

                                if self.is_relevant(title, summary):
                                    results.append({
                                        "title": title,
                                        "url": full_url,
                                        "summary": summary,
                                        "timestamp": datetime.utcnow().isoformat()
                                    })
                                    logger.info(f"Found relevant bill: {title}")
                            except Exception as e:
                                logger.error(f"Error processing item: {str(e)}")
                                continue

                        # Try to find and click the "Next" button
                        next_button = page.query_selector("a.pagination-next")
                        if next_button and "Next" in next_button.inner_text():
                            logger.info("Navigating to next page")
                            next_button.click()
                            page.wait_for_timeout(3000)  # Wait longer between pages
                            page.wait_for_load_state('networkidle')
                        else:
                            logger.info("No more pages to process")
                            break

                except PlaywrightTimeout as e:
                    logger.error(f"Timeout error: {str(e)}")
                except Exception as e:
                    logger.error(f"Error during scraping: {str(e)}")
                finally:
                    browser.close()

        except Exception as e:
            logger.error(f"Error in search_bills: {str(e)}")

        # Save results even if we encountered errors
        self.results = results
        self.save_results("congress_bills.json")
        return results

    def run(self) -> List[Dict]:
        return self.search_bills()

def main():
    try:
        scraper = CongressScraper()
        results = scraper.run()
    except Exception as e:
        logger.error(f"Error running Congress scraper: {str(e)}")

if __name__ == "__main__":
    main()
