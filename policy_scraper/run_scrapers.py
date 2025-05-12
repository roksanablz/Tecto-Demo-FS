"""
Main orchestrator script that runs all policy scrapers and merges their results.
This script coordinates the execution of:
1. AI Policy Scraper
2. Congress Scraper
3. Policy Merger
"""

import logging
import time
from datetime import datetime
from policy_scraper.scrapers.ai_policy import AIPolicyScraper
from policy_scraper.scrapers.congress import CongressScraper
from policy_scraper.merge_policy_updates import PolicyMerger

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def run_scrapers():
    """Run all scrapers and merge their results."""
    start_time = time.time()
    logger.info("Starting policy scraping process...")

    try:
        # Run AI Policy Scraper
        logger.info("Running AI Policy Scraper...")
        ai_scraper = AIPolicyScraper()
        ai_scraper.scrape_with_threading()
        ai_scraper.save_results()
        logger.info("AI Policy Scraper completed successfully")

        # Run Congress Scraper
        logger.info("Running Congress Scraper...")
        congress_scraper = CongressScraper()
        congress_scraper.run()
        logger.info("Congress Scraper completed successfully")

        # Merge results
        logger.info("Merging results...")
        merger = PolicyMerger()
        merger.create_merged_file()
        logger.info("Results merged successfully")

        # Calculate and log execution time
        execution_time = time.time() - start_time
        logger.info(f"Scraping process completed in {execution_time:.2f} seconds")

    except Exception as e:
        logger.error(f"Error during scraping process: {str(e)}")
        raise

def main():
    """Main entry point for the script."""
    try:
        run_scrapers()
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main() 