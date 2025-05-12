const fs = require('fs');
const path = require('path');

// Read and parse the JSON file
const jsonPath = path.join(__dirname, '..', 'policy_scraper', 'output', 'merged_policy_updates.json');
const policyData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Extract URLs from the policy data
const urls = policyData.map(policy => policy.url);

module.exports = urls;