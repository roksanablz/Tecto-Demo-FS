"""
Content processing utilities module for the policy scraper system.
This module provides functionality for content analysis, deduplication, and relevance checking.
It handles content hashing, similarity comparison, and keyword-based relevance assessment
to ensure high-quality and unique content collection.
"""

import hashlib
from difflib import SequenceMatcher
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ContentProcessor:
    """Utility class for content processing operations."""
    
    @staticmethod
    def get_content_hash(text: str) -> str:
        """Generate a hash of the content for deduplication."""
        try:
            normalized_text = ' '.join(text.lower().split())
            return hashlib.md5(normalized_text.encode()).hexdigest()
        except Exception as e:
            logger.error(f"Error generating content hash: {str(e)}")
            return ""

    @staticmethod
    def is_similar_content(text1: str, text2: str, threshold: float = 0.85) -> bool:
        """Check if two pieces of content are similar using SequenceMatcher."""
        try:
            return SequenceMatcher(None, text1.lower(), text2.lower()).ratio() > threshold
        except Exception as e:
            logger.error(f"Error comparing content similarity: {str(e)}")
            return False

    @staticmethod
    def is_relevant_content(text: str, url: str, keywords: List[str]) -> bool:
        """Check if content is relevant based on keywords."""
        try:
            text_lower = text.lower()
            url_lower = url.lower().replace('-', ' ')
            
            is_document = any(ext in url_lower for ext in ['.pdf', '.doc', '.docx'])
            
            # Check if any keyword appears in the text or URL
            for keyword in keywords:
                keyword_parts = keyword.split()
                # For multi-word keywords, check if all parts appear in order
                if len(keyword_parts) > 1:
                    if all(part in text_lower for part in keyword_parts) or all(part in url_lower for part in keyword_parts):
                        return True
                else:
                    if keyword in text_lower or keyword in url_lower:
                        return True
            
            # Additional check for documents
            if is_document:
                return any(keyword in text_lower for keyword in keywords)
            
            return False
        except Exception as e:
            logger.error(f"Error checking content relevance: {str(e)}")
            return False 