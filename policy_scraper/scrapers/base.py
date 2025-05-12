"""
Base scraper module that provides core functionality for all policy scrapers.
This module defines the BaseScraper class which implements common scraping operations
like URL validation, content deduplication, and result management. It serves as the
foundation for specialized scrapers like AIPolicyScraper and CongressScraper.
"""

import requests
import logging
from datetime import datetime
import json
import os
from typing import List, Dict, Set
from dotenv import load_dotenv
from policy_scraper.processors.url_processor import URLProcessor
from policy_scraper.processors.content_processor import ContentProcessor
from policy_scraper.exceptions.scraper_exceptions import ScraperError
from policy_scraper.utils.config import ScraperConfig

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class BaseScraper:
    def __init__(self, config: ScraperConfig = None):
        self.config = config or ScraperConfig()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.visited_urls: Set[str] = set()
        self.url_hashes: Set[str] = set()
        self.results: List[Dict] = []
        self.url_processor = URLProcessor()
        self.content_processor = ContentProcessor()

    def is_duplicate(self, url: str, title: str) -> bool:
        """Check if the URL or content is a duplicate."""
        normalized_url = self.url_processor.normalize_url(url)
        content_hash = self.content_processor.get_content_hash(title)
        
        # Check if the normalized URL has been visited
        if normalized_url in self.visited_urls:
            return True
            
        # Check if the content hash exists
        if content_hash in self.url_hashes:
            return True
            
        # Check for similar content and URLs
        for result in self.results:
            if self.content_processor.is_similar_content(title, result['title'], self.config.SIMILARITY_THRESHOLD):
                return True
            if normalized_url == result['normalized_url']:  # Use exact match for normalized URLs
                return True
        
        return False

    def validate_url(self, url: str) -> bool:
        """Validate if a URL is legitimate and accessible."""
        return self.url_processor.validate_url(url, self.headers, self.visited_urls)

    def save_results(self, filename: str):
        """Save the scraped results to a JSON file under output directory."""
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
        os.makedirs(output_dir, exist_ok=True)
        # If filename is not an absolute path, save under output_dir
        if not os.path.isabs(filename):
            filename = os.path.join(output_dir, filename)
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved {len(self.results)} results to {filename}")
        except Exception as e:
            logger.error(f"Error saving results: {str(e)}")

    def add_result(self, url: str, title: str, source_url: str):
        """Add a new result to the results list."""
        normalized_url = self.url_processor.normalize_url(url)
        content_hash = self.content_processor.get_content_hash(title)
        
        if not self.is_duplicate(url, title):
            self.url_hashes.add(content_hash)
            self.visited_urls.add(normalized_url)
            
            self.results.append({
                'url': url,
                'title': title,
                'source_url': source_url,
                'timestamp': datetime.now().isoformat(),
                'normalized_url': normalized_url
            })
            logger.debug(f"Added new result: {url}") 