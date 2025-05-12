"""
Tests for the Policy Merger
"""
import unittest
from unittest.mock import patch, mock_open
import json
import os
from policy_scraper.merge_policy_updates import PolicyMerger

class TestPolicyMerger(unittest.TestCase):
    def setUp(self):
        self.merger = PolicyMerger()
        
        # Sample test data
        self.ai_policy_data = [
            {
                "url": "https://example.com/policy1",
                "normalized_url": "https://example.com/policy1",
                "title": "AI Policy Update 1",
                "timestamp": "2024-03-20T10:00:00Z"
            },
            {
                "url": "https://example.com/policy2",
                "normalized_url": "https://example.com/policy2",
                "title": "AI Policy Update 2",
                "timestamp": "2024-03-19T10:00:00Z"
            }
        ]
        
        self.congress_data = [
            {
                "url": "https://congress.gov/bill1",
                "normalized_url": "https://congress.gov/bill1",
                "title": "AI Governance Bill",
                "timestamp": "2024-03-18T10:00:00Z"
            },
            {
                "url": "https://congress.gov/bill2",
                "normalized_url": "https://congress.gov/bill2",
                "title": "AI Safety Bill",
                "timestamp": "2024-03-17T10:00:00Z"
            }
        ]

    def test_get_content_hash(self):
        """Test content hashing functionality"""
        text1 = "AI Policy Update"
        text2 = "AI Policy Update"  # Same content
        text3 = "Different Policy"
        
        hash1 = self.merger.get_content_hash(text1)
        hash2 = self.merger.get_content_hash(text2)
        hash3 = self.merger.get_content_hash(text3)
        
        self.assertEqual(hash1, hash2)  # Same content should have same hash
        self.assertNotEqual(hash1, hash3)  # Different content should have different hash

    def test_add_unique_items(self):
        """Test adding unique items"""
        # Test with unique items
        unique_items = self.merger.add_unique_items(self.ai_policy_data)
        self.assertEqual(len(unique_items), 2)
        
        # Test with duplicate items
        duplicate_data = self.ai_policy_data + [self.ai_policy_data[0]]  # Add duplicate
        unique_items = self.merger.add_unique_items(duplicate_data)
        self.assertEqual(len(unique_items), 0)  # Should be 0 as all items are now duplicates

    @patch('builtins.open', new_callable=mock_open)
    @patch('json.load')
    @patch('json.dump')
    def test_create_merged_file_success(self, mock_json_dump, mock_json_load, mock_file):
        """Test successful creation of merged file"""
        # Mock file existence
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = True
            
            # Mock JSON loading
            mock_json_load.side_effect = [self.ai_policy_data, self.congress_data]
            
            # Run the merger
            self.merger.create_merged_file()
            
            # Verify JSON dump was called with correct data
            mock_json_dump.assert_called_once()
            args, kwargs = mock_json_dump.call_args
            merged_data = args[0]
            
            # Verify merged data
            self.assertEqual(len(merged_data), 4)  # All items should be included
            self.assertEqual(merged_data[0]['title'], "AI Policy Update 1")  # Should be sorted by timestamp

    @patch('builtins.open', new_callable=mock_open)
    @patch('json.load')
    @patch('json.dump')
    def test_create_merged_file_missing_files(self, mock_json_dump, mock_json_load, mock_file):
        """Test handling of missing input files"""
        # Mock file existence
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = False
            
            # Run the merger
            self.merger.create_merged_file()
            
            # Verify JSON dump was called with empty list
            mock_json_dump.assert_called_once()
            args, kwargs = mock_json_dump.call_args
            merged_data = args[0]
            
            self.assertEqual(len(merged_data), 0)

    @patch('builtins.open', new_callable=mock_open)
    @patch('json.load')
    def test_create_merged_file_json_error(self, mock_json_load, mock_file):
        """Test handling of JSON loading errors"""
        # Mock file existence
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = True
            
            # Mock JSON loading error
            mock_json_load.side_effect = json.JSONDecodeError("Invalid JSON", "", 0)
            
            # Run the merger
            self.merger.create_merged_file()
            
            # Verify file was opened but no data was written
            mock_file.assert_called()

    def test_duplicate_detection(self):
        """Test duplicate detection across different sources"""
        # Add items from first source
        self.merger.add_unique_items(self.ai_policy_data)
        
        # Create similar items with slightly different URLs
        similar_data = [
            {
                "url": "https://example.com/policy1?utm_source=test",
                "normalized_url": "https://example.com/policy1",
                "title": "AI Policy Update 1",
                "timestamp": "2024-03-20T10:00:00Z"
            }
        ]
        
        # Try to add similar items
        unique_items = self.merger.add_unique_items(similar_data)
        self.assertEqual(len(unique_items), 0)  # Should detect as duplicate

if __name__ == '__main__':
    unittest.main() 