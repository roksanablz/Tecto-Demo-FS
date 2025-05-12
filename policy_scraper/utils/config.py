"""
Configuration module that defines settings and parameters for all scrapers.
This module contains configuration classes for different scraper types, including
base settings, trusted domains, search queries, and API endpoints. It uses dataclasses
for clean and maintainable configuration management.
"""

from typing import Set, List
from dataclasses import dataclass, field
from enum import Enum

@dataclass
class ScraperConfig:
    """Base configuration for all scrapers."""
    MAX_WORKERS: int = 5
    REQUEST_TIMEOUT: int = 10
    SEARCH_DELAY: int = 2
    SIMILARITY_THRESHOLD: float = 0.85
    URL_SIMILARITY_THRESHOLD: float = 0.9

@dataclass
class AIScraperConfig(ScraperConfig):
    """Configuration for the AI Policy Scraper."""
    TRUSTED_DOMAINS: Set[str] = field(default_factory=lambda: {
        'whitehouse.gov', 'europa.eu', 'gov.uk', 'canada.ca', 'congress.gov',
        'fda.gov', 'nist.gov', 'oecd.org', 'un.org', 'weforum.org',
        'brookings.edu', 'mit.edu', 'harvard.edu', 'csis.org',
        'futureoflife.org', 'pdpc.gov.sg', 'leg.colorado.gov',
        'gov', 'edu', 'org', 'int', 'oecd', 'un', 'unesco', 'europa', 'weforum',
        'brookings', 'mit', 'stanford', 'harvard', 'oxford', 'cambridge'
    })
    
    SEARCH_QUERIES: List[str] = field(default_factory=lambda: [
        'latest AI policy updates government',
        'artificial intelligence regulations 2024',
        'AI governance framework official',
        'international AI policy guidelines',
        'AI ethics regulations updates',
        'global AI policy developments',
        'AI regulatory framework latest',
        'government AI policy documents'
    ])
    
    KEYWORDS: List[str] = field(default_factory=lambda: [
        'ai policy', 'artificial intelligence', 'regulation',
        'guidelines', 'ethics', 'governance', 'framework',
        'legislation', 'standards', 'compliance', 'white paper',
        'report', 'recommendation', 'directive', 'initiative'
    ])

@dataclass
class CongressScraperConfig(ScraperConfig):
    """Configuration for the Congress Scraper."""
    CONGRESS_NUMBER: str = "118,117"  # Current and previous Congress
    BASE_API_URL: str = "https://api.congress.gov/v3"
    SEARCH_TERM: str = "(artificial+intelligence+OR+machine+learning+OR+AI+regulation+OR+algorithmic+OR+autonomous+systems)"
    REQUEST_TIMEOUT: int = 30  # Increased timeout for API calls
    MAX_RETRIES: int = 5  # Increased max retries
    RETRY_DELAY: int = 10  # Increased base delay for exponential backoff
    RATE_LIMIT_PAUSE: int = 120  # Increased pause time when rate limited (seconds)
    SEARCH_DELAY: int = 30  # Added delay between search requests 