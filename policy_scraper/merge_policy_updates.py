"""
Policy merger module that combines results from different policy scrapers.
"""

import json
import os
import logging
from typing import List, Dict
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PolicyMerger:
    def __init__(self):
        self.seen_urls = set()
        self.seen_hashes = set()

    def get_content_hash(self, text: str) -> str:
        """Generate a hash of the content for deduplication."""
        import hashlib
        normalized_text = ' '.join(text.lower().split())
        return hashlib.md5(normalized_text.encode()).hexdigest()

    def add_unique_items(self, items: List[Dict]) -> List[Dict]:
        """Add unique items to the results list."""
        unique_items = []
        
        for item in items:
            # Use normalized_url if present, otherwise use url
            normalized_url = item.get('normalized_url', item['url'])
            content_hash = self.get_content_hash(item['title'])
            
            if normalized_url not in self.seen_urls and content_hash not in self.seen_hashes:
                self.seen_urls.add(normalized_url)
                self.seen_hashes.add(content_hash)
                unique_items.append(item)
        
        return unique_items

    def create_merged_file(self, output_filename: str = 'merged_policy_updates.json'):
        import os
        output_dir = os.path.join(os.path.dirname(__file__), 'output')
        os.makedirs(output_dir, exist_ok=True)
        if not os.path.isabs(output_filename):
            output_filename = os.path.join(output_dir, output_filename)
        try:
            merged_results = []
            
            # Define paths for input files using the same directory structure
            ai_policy_path = os.path.join(output_dir, 'ai_policy_updates.json')
            congress_bills_path = os.path.join(output_dir, 'congress_bills.json')
            
            # Add AI policy results
            if os.path.exists(ai_policy_path):
                with open(ai_policy_path, 'r', encoding='utf-8') as f:
                    ai_policy_data = json.load(f)
                merged_results.extend(self.add_unique_items(ai_policy_data))
                logger.info(f"Loaded {len(ai_policy_data)} AI policy updates")
            
            # Add Congress bills if available
            if os.path.exists(congress_bills_path):
                with open(congress_bills_path, 'r', encoding='utf-8') as f:
                    congress_data = json.load(f)
                merged_results.extend(self.add_unique_items(congress_data))
                logger.info(f"Loaded {len(congress_data)} Congress bills")
            
            # Sort merged results by timestamp
            merged_results.sort(key=lambda x: x['timestamp'], reverse=True)
            
            # Save merged results
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(merged_results, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved {len(merged_results)} merged results to {output_filename}")
            
        except Exception as e:
            logger.error(f"Error creating merged file: {str(e)}")

def main():
    try:
        merger = PolicyMerger()
        merger.create_merged_file()
    except Exception as e:
        logger.error(f"Error running policy merger: {str(e)}")

if __name__ == "__main__":
    main() 