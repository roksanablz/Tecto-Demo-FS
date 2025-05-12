"""
AI Policy Scraper module for collecting AI-related policy updates and regulations.
This module implements a specialized scraper that uses Google Custom Search API to discover
and extract AI policy information from trusted government and educational sources.
It handles concurrent scraping, content relevance checking, and result deduplication.
"""

import requests
from bs4 import BeautifulSoup
import validators
from datetime import datetime
import json
import logging
from typing import List, Dict, Set, Optional
import time
from urllib.parse import urljoin, urlparse, urlunparse
import re
import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
import concurrent.futures
from difflib import SequenceMatcher
import hashlib
import tldextract
from .base import BaseScraper
from policy_scraper.merge_policy_updates import PolicyMerger
from dataclasses import dataclass, field
from enum import Enum
from ..utils.config import AIScraperConfig
from ..exceptions.scraper_exceptions import ConfigurationError, APIError
from ..processors.url_processor import URLProcessor
from ..processors.content_processor import ContentProcessor

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ScraperError(Exception):
    """Base exception for scraper-related errors."""
    pass

class URLProcessingError(ScraperError):
    """Raised when there are issues processing URLs."""
    pass

class URLProcessor:
    """Utility class for URL processing operations."""
    
    @staticmethod
    def normalize_url(url: str) -> str:
        """Normalize URL by removing common variations."""
        try:
            parsed = urlparse(url)
            path = parsed.path.rstrip('/')
            query = re.sub(r'[?&](utm_source|utm_medium|utm_campaign|utm_term|utm_content)=[^&]+', '', parsed.query)
            fragment = ''
            
            normalized = urlunparse((
                parsed.scheme,
                parsed.netloc.lower(),
                path,
                parsed.params,
                query,
                fragment
            ))
            
            return normalized
        except Exception as e:
            raise URLProcessingError(f"Error normalizing URL {url}: {str(e)}")

    @staticmethod
    def is_trusted_domain(url: str, trusted_domains: Set[str]) -> bool:
        """Check if the URL belongs to a trusted domain."""
        try:
            domain = urlparse(url).netloc.lower()
            return any(trusted in domain for trusted in trusted_domains)
        except Exception as e:
            raise URLProcessingError(f"Error checking trusted domain for {url}: {str(e)}")

    @staticmethod
    def validate_url(url: str, headers: Dict[str, str], visited_urls: Set[str]) -> bool:
        """Validate if a URL is legitimate and accessible."""
        try:
            if not validators.url(url):
                return False
            if url in visited_urls:
                return False
            response = requests.head(url, headers=headers, timeout=AIScraperConfig.REQUEST_TIMEOUT)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Error validating URL {url}: {str(e)}")
            return False

class AIPolicyScraper(BaseScraper):
    def __init__(self, api_key: Optional[str] = None, search_engine_id: Optional[str] = None, config: Optional[AIScraperConfig] = None):
        super().__init__(config=config or AIScraperConfig())
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Get credentials from environment variables if not provided
        self.api_key = api_key or os.getenv('GOOGLE_API_KEY')
        self.search_engine_id = search_engine_id or os.getenv('GOOGLE_CSE_ID')
        
        if not self.api_key or not self.search_engine_id:
            raise ConfigurationError(
                "Google API key and Search Engine ID are required. "
                "Set them in GOOGLE_API_KEY and GOOGLE_CSE_ID environment variables "
                "or pass them to the constructor."
            )
        
        # Initialize the Google Custom Search API service
        self.service = build(
            "customsearch", "v1",
            developerKey=self.api_key,
            cache_discovery=False
        )
        
        self.url_processor = URLProcessor()
        self.content_processor = ContentProcessor()

    def run(self) -> List[Dict]:
        """Run the scraper to collect AI policy updates."""
        try:
            for query in self.config.SEARCH_QUERIES:
                self.search_policies(query)
                time.sleep(self.config.SEARCH_DELAY)
            return self.results
        except Exception as e:
            logger.error(f"Error running AI Policy scraper: {str(e)}")
            raise APIError(f"Error running AI Policy scraper: {str(e)}")

    def search_policies(self, query: str) -> List[Dict]:
        """Search for AI policies using Google Custom Search API."""
        try:
            result = self.service.cse().list(
                q=query,
                cx=self.search_engine_id,
                num=10
            ).execute()
            
            if 'items' in result:
                for item in result['items']:
                    url = item.get('link')
                    title = item.get('title', '')
                    snippet = item.get('snippet', '')
                    if url and self.url_processor.is_trusted_domain(url, self.config.TRUSTED_DOMAINS):
                        self.add_result(url, title, 'https://www.google.com')
            
            return self.results
        except Exception as e:
            logger.error(f"Error searching for query '{query}': {str(e)}")
            raise APIError(f"Error searching for query '{query}': {str(e)}")

    def fetch_policy_content(self, url: str) -> str:
        """Fetch and extract content from a policy URL."""
        try:
            response = requests.get(url, headers=self.headers, timeout=self.config.REQUEST_TIMEOUT)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            return soup.get_text(strip=True)
        except Exception as e:
            logger.error(f"Error fetching content from {url}: {str(e)}")
            raise APIError(f"Error fetching content from {url}: {str(e)}")

    def is_relevant_content(self, text: str) -> bool:
        """Check if content is relevant to AI policy."""
        return self.content_processor.is_relevant_content(text, "", self.config.KEYWORDS)

    def get_content_hash(self, text: str) -> str:
        """Generate a hash of the content for deduplication."""
        normalized_text = ' '.join(text.lower().split())
        return hashlib.md5(normalized_text.encode()).hexdigest()

    def is_similar_content(self, text1: str, text2: str) -> bool:
        """Check if two pieces of content are similar using SequenceMatcher."""
        return SequenceMatcher(None, text1.lower(), text2.lower()).ratio() > self.config.SIMILARITY_THRESHOLD

    def is_duplicate(self, url: str, title: str) -> bool:
        """Check if the URL or content is a duplicate."""
        normalized_url = self.url_processor.normalize_url(url)
        content_hash = self.get_content_hash(title)
        
        if normalized_url in self.visited_urls:
            return True
            
        if content_hash in self.url_hashes:
            return True
            
        for existing_url in self.visited_urls:
            if self.is_similar_content(normalized_url, existing_url):
                return True
        
        return False

    def discover_urls(self) -> List[str]:
        """Discover relevant URLs using Google Custom Search API."""
        discovered_urls = set()
        
        for query in self.config.SEARCH_QUERIES:
            try:
                result = self.service.cse().list(
                    q=query,
                    cx=self.search_engine_id,
                    num=10
                ).execute()
                
                if 'items' in result:
                    for item in result['items']:
                        url = item.get('link')
                        if url and self.url_processor.is_trusted_domain(url, self.config.TRUSTED_DOMAINS):
                            discovered_urls.add(url)
                
                time.sleep(self.config.SEARCH_DELAY)
                
            except Exception as e:
                logger.error(f"Error searching for query '{query}': {str(e)}")
                raise APIError(f"Error searching for query '{query}': {str(e)}")
        
        return list(discovered_urls)

    def _is_relevant_link(self, text: str, url: str) -> bool:
        """Check if a link is relevant to AI policy."""
        return self.content_processor.is_relevant_content(text, url, self.config.KEYWORDS)

    def extract_links(self, url: str) -> List[Dict]:
        """Extract relevant links from a discovered URL."""
        try:
            self.visited_urls.add(url)
            response = requests.get(url, headers=self.headers, timeout=self.config.REQUEST_TIMEOUT)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            for a_tag in soup.find_all('a', href=True):
                href = a_tag.get('href')
                text = a_tag.get_text(strip=True)
                
                full_url = urljoin(url, href)
                
                if self._is_relevant_link(text, full_url):
                    if (self.url_processor.validate_url(full_url, self.headers, self.visited_urls) and 
                        self.url_processor.is_trusted_domain(full_url, self.config.TRUSTED_DOMAINS)):
                        self.add_result(full_url, text, url)
            
            return self.results
        except Exception as e:
            logger.error(f"Error extracting links from {url}: {str(e)}")
            return []

    def scrape_with_threading(self):
        """Scrape discovered URLs using threading for better performance."""
        discovered_urls = self.discover_urls()
        logger.info(f"Discovered {len(discovered_urls)} potential URLs")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.config.MAX_WORKERS) as executor:
            future_to_url = {executor.submit(self.extract_links, url): url for url in discovered_urls}
            
            for future in concurrent.futures.as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    future.result()
                except Exception as e:
                    logger.error(f"Error processing {url}: {str(e)}")

    def save_results(self, filename: str = 'ai_policy_updates.json'):
        """Save the scraped results to a JSON file in the output directory."""
        super().save_results(filename)

def main():
    try:
        scraper = AIPolicyScraper()
        scraper.scrape_with_threading()
        scraper.save_results()
        
        # merger = PolicyMerger()
        # merger.create_merged_file()
        
    except Exception as e:
        logger.error(f"Error running AI Policy scraper: {str(e)}")

if __name__ == "__main__":
    main() 