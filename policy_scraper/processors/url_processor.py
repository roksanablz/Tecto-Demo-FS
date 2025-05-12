"""
URL processing utilities module for the policy scraper system.
This module provides functionality for URL normalization, validation, and domain checking.
It handles URL parsing, cleaning, and verification to ensure only valid and trusted
URLs are processed by the scrapers.
"""

import re
from urllib.parse import urlparse, urlunparse
from typing import Set, Dict
import requests
import validators
import logging

logger = logging.getLogger(__name__)

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
            logger.error(f"Error normalizing URL {url}: {str(e)}")
            return url

    @staticmethod
    def is_trusted_domain(url: str, trusted_domains: Set[str]) -> bool:
        """Check if the URL belongs to a trusted domain."""
        try:
            domain = urlparse(url).netloc.lower()
            return any(trusted in domain for trusted in trusted_domains)
        except Exception as e:
            logger.error(f"Error checking trusted domain for {url}: {str(e)}")
            return False

    @staticmethod
    def validate_url(url: str, headers: Dict[str, str], visited_urls: Set[str], timeout: int = 10) -> bool:
        """Validate if a URL is legitimate and accessible."""
        try:
            if not validators.url(url):
                return False
            if url in visited_urls:
                return False
            response = requests.head(url, headers=headers, timeout=timeout)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Error validating URL {url}: {str(e)}")
            return False 