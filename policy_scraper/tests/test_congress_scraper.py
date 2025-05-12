"""
Tests for the Congress Scraper
"""
import unittest
from unittest.mock import Mock, patch, MagicMock
import json
from datetime import datetime
from policy_scraper.scrapers.congress import CongressScraper
from policy_scraper.utils.config import CongressScraperConfig

class TestCongressScraper(unittest.TestCase):
    def setUp(self):
        self.config = CongressScraperConfig()
        self.scraper = CongressScraper(config=self.config)

    def test_init(self):
        """Test initialization of CongressScraper"""
        self.assertEqual(self.scraper.query, self.config.SEARCH_TERM or "artificial intelligence")
        self.assertEqual(self.scraper.base_url, "https://www.congress.gov/search")
        self.assertEqual(self.scraper.timeout, 60000)
        self.assertIsInstance(self.scraper.processed_urls, set)

    def test_is_relevant(self):
        """Test relevance checking of bills"""
        # Test relevant content
        relevant_title = "AI Governance Act of 2024"
        relevant_summary = "A bill to regulate artificial intelligence systems"
        self.assertTrue(self.scraper.is_relevant(relevant_title, relevant_summary))

        # Test irrelevant content
        irrelevant_title = "Agriculture Bill 2024"
        irrelevant_summary = "A bill about farming subsidies"
        self.assertFalse(self.scraper.is_relevant(irrelevant_title, irrelevant_summary))

    @patch('policy_scraper.scrapers.congress.sync_playwright')
    def test_search_bills_success(self, mock_playwright):
        """Test successful bill search"""
        # Mock Playwright setup
        mock_browser = Mock()
        mock_context = Mock()
        mock_page = Mock()
        
        # Setup mock chain
        mock_playwright.return_value.__enter__.return_value = Mock()
        mock_playwright.return_value.__enter__.return_value.chromium.launch.return_value = mock_browser
        mock_browser.new_context.return_value = mock_context
        mock_context.new_page.return_value = mock_page

        # Mock page content
        mock_item = Mock()
        mock_title_tag = Mock()
        mock_summary_tag = Mock()
        
        # Setup mock element chain
        mock_page.query_selector_all.return_value = [mock_item]
        mock_item.query_selector.side_effect = [mock_title_tag, mock_summary_tag]
        mock_title_tag.inner_text.return_value = "AI Governance Act"
        mock_title_tag.get_attribute.return_value = "/bill/123"
        mock_summary_tag.inner_text.return_value = "A bill about artificial intelligence"
        
        # Mock pagination
        mock_page.query_selector.return_value = None  # No next page

        # Run the test
        results = self.scraper.search_bills()

        # Verify results
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["title"], "AI Governance Act")
        self.assertEqual(results[0]["url"], "https://www.congress.gov/bill/123")
        self.assertEqual(results[0]["summary"], "A bill about artificial intelligence")
        self.assertIn("timestamp", results[0])

    @patch('policy_scraper.scrapers.congress.sync_playwright')
    def test_search_bills_no_results(self, mock_playwright):
        """Test bill search with no results"""
        # Mock Playwright setup
        mock_browser = Mock()
        mock_context = Mock()
        mock_page = Mock()
        
        # Setup mock chain
        mock_playwright.return_value.__enter__.return_value = Mock()
        mock_playwright.return_value.__enter__.return_value.chromium.launch.return_value = mock_browser
        mock_browser.new_context.return_value = mock_context
        mock_context.new_page.return_value = mock_page

        # Mock no results message
        mock_page.query_selector.return_value = Mock()  # Simulate finding no-results-message

        # Run the test
        results = self.scraper.search_bills()

        # Verify results
        self.assertEqual(len(results), 0)

    @patch('policy_scraper.scrapers.congress.sync_playwright')
    def test_search_bills_timeout(self, mock_playwright):
        """Test bill search with timeout"""
        # Mock Playwright setup
        mock_browser = Mock()
        mock_context = Mock()
        mock_page = Mock()
        
        # Setup mock chain
        mock_playwright.return_value.__enter__.return_value = Mock()
        mock_playwright.return_value.__enter__.return_value.chromium.launch.return_value = mock_browser
        mock_browser.new_context.return_value = mock_context
        mock_context.new_page.return_value = mock_page

        # Mock timeout
        mock_page.wait_for_selector.side_effect = Exception("Timeout")

        # Run the test
        results = self.scraper.search_bills()

        # Verify results
        self.assertEqual(len(results), 0)

    def test_duplicate_url_handling(self):
        """Test handling of duplicate URLs"""
        # Add a URL to processed_urls
        test_url = "https://www.congress.gov/bill/123"
        self.scraper.processed_urls.add(test_url)

        # Mock Playwright setup
        with patch('policy_scraper.scrapers.congress.sync_playwright') as mock_playwright:
            mock_browser = Mock()
            mock_context = Mock()
            mock_page = Mock()
            
            # Setup mock chain
            mock_playwright.return_value.__enter__.return_value = Mock()
            mock_playwright.return_value.__enter__.return_value.chromium.launch.return_value = mock_browser
            mock_browser.new_context.return_value = mock_context
            mock_context.new_page.return_value = mock_page

            # Mock page content with duplicate URL
            mock_item = Mock()
            mock_title_tag = Mock()
            mock_summary_tag = Mock()
            
            mock_page.query_selector_all.return_value = [mock_item]
            mock_item.query_selector.side_effect = [mock_title_tag, mock_summary_tag]
            mock_title_tag.inner_text.return_value = "AI Governance Act"
            mock_title_tag.get_attribute.return_value = "/bill/123"
            mock_summary_tag.inner_text.return_value = "A bill about artificial intelligence"
            
            # Mock pagination
            mock_page.query_selector.return_value = None

            # Run the test
            results = self.scraper.search_bills()

            # Verify results - should be empty due to duplicate URL
            self.assertEqual(len(results), 0)

if __name__ == '__main__':
    unittest.main() 