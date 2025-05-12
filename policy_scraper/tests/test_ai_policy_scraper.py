"""
Tests for the AI Policy Scraper
"""
import unittest
from unittest.mock import Mock, patch, MagicMock
import json
import os
from policy_scraper.scrapers.ai_policy import AIPolicyScraper, URLProcessingError
from policy_scraper.utils.config import AIScraperConfig
from policy_scraper.exceptions.scraper_exceptions import ConfigurationError, APIError

class TestAIPolicyScraper(unittest.TestCase):
    def setUp(self):
        self.mock_api_key = "test_api_key"
        self.mock_search_engine_id = "test_search_engine_id"
        self.config = AIScraperConfig()
        
        # Mock environment variables
        self.env_patcher = patch.dict(os.environ, {
            'GOOGLE_API_KEY': self.mock_api_key,
            'GOOGLE_CSE_ID': self.mock_search_engine_id
        })
        self.env_patcher.start()

    def tearDown(self):
        self.env_patcher.stop()

    @patch('policy_scraper.scrapers.ai_policy.build')
    def test_init_success(self, mock_build):
        """Test successful initialization of AIPolicyScraper"""
        scraper = AIPolicyScraper()
        self.assertEqual(scraper.api_key, self.mock_api_key)
        self.assertEqual(scraper.search_engine_id, self.mock_search_engine_id)
        mock_build.assert_called_once()

    def test_init_missing_credentials(self):
        """Test initialization fails when credentials are missing"""
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(ConfigurationError):
                AIPolicyScraper()

    @patch('policy_scraper.scrapers.ai_policy.build')
    @patch('policy_scraper.scrapers.ai_policy.requests.get')
    def test_fetch_policy_content_success(self, mock_get, mock_build):
        """Test successful content fetching"""
        # Setup mock response
        mock_response = Mock()
        mock_response.text = "<html><body>Test content</body></html>"
        mock_get.return_value = mock_response

        scraper = AIPolicyScraper()
        content = scraper.fetch_policy_content("https://test.com")
        
        self.assertEqual(content, "Test content")
        mock_get.assert_called_once()

    @patch('policy_scraper.scrapers.ai_policy.build')
    @patch('policy_scraper.scrapers.ai_policy.requests.get')
    def test_fetch_policy_content_error(self, mock_get, mock_build):
        """Test content fetching error handling"""
        mock_get.side_effect = Exception("Network error")
        
        scraper = AIPolicyScraper()
        with self.assertRaises(APIError):
            scraper.fetch_policy_content("https://test.com")

    @patch('policy_scraper.scrapers.ai_policy.build')
    def test_is_relevant_content(self, mock_build):
        """Test content relevance checking"""
        scraper = AIPolicyScraper()
        
        # Test relevant content
        relevant_text = "This is about artificial intelligence policy and regulations"
        self.assertTrue(scraper.is_relevant_content(relevant_text))
        
        # Test irrelevant content
        irrelevant_text = "This is about cooking recipes"
        self.assertFalse(scraper.is_relevant_content(irrelevant_text))

    @patch('policy_scraper.scrapers.ai_policy.build')
    def test_url_processing(self, mock_build):
        """Test URL processing functionality"""
        scraper = AIPolicyScraper()
        
        # Test URL normalization - should keep UTM parameters
        test_url = "https://example.com/path?utm_source=test#fragment"
        normalized = scraper.url_processor.normalize_url(test_url)
        self.assertEqual(normalized, "https://example.com/path?utm_source=test")
        
        # Test trusted domain checking
        self.assertTrue(scraper.url_processor.is_trusted_domain(
            "https://whitehouse.gov/policy",
            {"whitehouse.gov"}
        ))

    @patch('policy_scraper.scrapers.ai_policy.build')
    def test_duplicate_detection(self, mock_build):
        """Test duplicate content detection"""
        scraper = AIPolicyScraper()
        
        url1 = "https://example.com/policy1"
        url2 = "https://example.com/policy1?utm_source=test"
        title = "AI Policy Update"
        
        # First URL should not be a duplicate
        self.assertFalse(scraper.is_duplicate(url1, title))
        # Second URL should also not be a duplicate, since normalization keeps query params
        self.assertFalse(scraper.is_duplicate(url2, title))

    @patch('policy_scraper.scrapers.ai_policy.build')
    def test_save_results(self, mock_build):
        """Test saving results to file"""
        scraper = AIPolicyScraper()
        test_results = [
            {
                "url": "https://example.com/policy1",
                "title": "Test Policy 1",
                "source": "https://example.com"
            }
        ]
        scraper.results = test_results
        
        # Test saving results
        test_filename = "test_results.json"
        scraper.save_results(test_filename)
        
        # Verify file was created and contains correct data
        self.assertTrue(os.path.exists(test_filename))
        with open(test_filename, 'r') as f:
            saved_data = json.load(f)
            self.assertEqual(saved_data, test_results)
        
        # Cleanup
        os.remove(test_filename)

if __name__ == '__main__':
    unittest.main() 