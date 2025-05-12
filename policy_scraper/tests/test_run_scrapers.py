"""
Tests for the main scraper orchestrator
"""
import unittest
from unittest.mock import Mock, patch
import logging
from policy_scraper.run_scrapers import run_scrapers

class TestRunScrapers(unittest.TestCase):
    def setUp(self):
        # Disable logging during tests
        logging.disable(logging.CRITICAL)
        
    def tearDown(self):
        # Re-enable logging
        logging.disable(logging.NOTSET)

    @patch('policy_scraper.run_scrapers.AIPolicyScraper')
    @patch('policy_scraper.run_scrapers.CongressScraper')
    @patch('policy_scraper.run_scrapers.PolicyMerger')
    def test_run_scrapers_success(self, mock_merger, mock_congress, mock_ai):
        # Setup mocks
        mock_ai_instance = Mock()
        mock_ai.return_value = mock_ai_instance
        
        mock_congress_instance = Mock()
        mock_congress.return_value = mock_congress_instance
        
        mock_merger_instance = Mock()
        mock_merger.return_value = mock_merger_instance

        # Run the function
        run_scrapers()

        # Verify AI Policy Scraper was called correctly
        mock_ai_instance.scrape_with_threading.assert_called_once()
        mock_ai_instance.save_results.assert_called_once()

        # Verify Congress Scraper was called correctly
        mock_congress_instance.run.assert_called_once()

        # Verify Policy Merger was called correctly
        mock_merger_instance.create_merged_file.assert_called_once()

    @patch('policy_scraper.run_scrapers.AIPolicyScraper')
    def test_run_scrapers_ai_scraper_error(self, mock_ai):
        # Setup mock to raise an exception
        mock_ai_instance = Mock()
        mock_ai_instance.scrape_with_threading.side_effect = Exception("AI Scraper Error")
        mock_ai.return_value = mock_ai_instance

        # Verify the exception is propagated
        with self.assertRaises(Exception) as context:
            run_scrapers()
        
        self.assertEqual(str(context.exception), "AI Scraper Error")

if __name__ == '__main__':
    unittest.main() 