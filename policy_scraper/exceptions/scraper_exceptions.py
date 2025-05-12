"""
Custom exceptions module for the policy scraper system.
This module defines a hierarchy of custom exceptions for different types of errors
that may occur during scraping operations, including configuration issues,
URL processing errors, API failures, and content validation problems.
"""

class ScraperError(Exception):
    """Base exception for scraper-related errors."""
    pass

class ConfigurationError(ScraperError):
    """Raised when there are issues with configuration."""
    pass

class URLProcessingError(ScraperError):
    """Raised when there are issues processing URLs."""
    pass

class APIError(ScraperError):
    """Raised when there are issues with external API calls."""
    pass

class ValidationError(ScraperError):
    """Raised when there are validation issues."""
    pass

class ContentProcessingError(ScraperError):
    """Raised when there are issues processing content."""
    pass 