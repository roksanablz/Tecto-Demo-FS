/**
 * Policy Cleanup Script
 * 
 * This script cleans up the policies.json file by:
 * 1. Removing policies with "unknown" values in key fields (name, region, status, progress, impact, or leader details)
 * 2. Removing policies that haven't had any activity in the last 5 years (based on dates in recentChanges and futureMilestones)
 * 3. Removing duplicate policies (based on name and source URL)
 * 4. Sorting the remaining policies by most recent date
 * 
 * The script will:
 * - Read the policies.json file
 * - Apply the cleanup rules
 * - Save the cleaned data to a new file (policies.cleaned.json)
 * - Print statistics about how many policies were removed
 * 
 * This script is part of the policy management system and works alongside:
 * - policy-crawler/api.js: Serves the cleaned policies to the frontend
 * - components/PolicySenseTab.tsx: Displays the policies in the UI
 * - policy_scraper/: System that collects new policy updates
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  POLICIES_FILE: path.join(__dirname, 'policies.json'),
  CLEANED_FILE: path.join(__dirname, 'policies.cleaned.json'),
  YEARS_THRESHOLD: 5
};

// Helper function to check if a policy is "unknown"
const isUnknownPolicy = (policy) => {
  return policy.name === 'unknown' || 
         policy.region === 'unknown' || 
         policy.status === 'unknown' ||
         policy.progress === 'unknown' ||
         policy.impact === 'unknown' ||
         (policy.leader && (
           policy.leader.name === 'unknown' ||
           policy.leader.role === 'unknown' ||
           policy.leader.organization === 'unknown'
         ));
};

// Helper function to get the most recent date from a policy
const getMostRecentDate = (policy) => {
  const dates = [];
  
  // Check recentChanges
  if (policy.recentChanges && policy.recentChanges.length > 0) {
    dates.push(...policy.recentChanges.map(change => new Date(change.date)));
  }
  
  // Check futureMilestones
  if (policy.futureMilestones && policy.futureMilestones.length > 0) {
    dates.push(...policy.futureMilestones.map(milestone => new Date(milestone.date)));
  }
  
  return dates.length > 0 ? new Date(Math.max(...dates)) : null;
};

// Helper function to check if a policy is old (no activity in last 5 years)
const isOldPolicy = (policy) => {
  const mostRecentDate = getMostRecentDate(policy);
  if (!mostRecentDate) return true;
  
  const yearsAgo = new Date();
  yearsAgo.setFullYear(yearsAgo.getFullYear() - CONFIG.YEARS_THRESHOLD);
  
  return mostRecentDate < yearsAgo;
};

// Helper function to create a unique key for a policy
const getPolicyKey = (policy) => {
  return `${policy.name}-${policy.source}`;
};

// Main cleanup function
const cleanupPolicies = () => {
  try {
    // Read the policies file
    const policiesData = JSON.parse(fs.readFileSync(CONFIG.POLICIES_FILE, 'utf-8'));

    // Clean up the policies
    const cleanedPolicies = policiesData.policies
      // Remove unknown policies
      .filter(policy => !isUnknownPolicy(policy))
      // Remove old policies
      .filter(policy => !isOldPolicy(policy))
      // Remove duplicates
      .reduce((acc, policy) => {
        const key = getPolicyKey(policy);
        if (!acc.has(key)) {
          acc.set(key, policy);
        }
        return acc;
      }, new Map());

    // Convert back to array and sort by most recent change date
    const finalPolicies = Array.from(cleanedPolicies.values())
      .sort((a, b) => {
        const dateA = getMostRecentDate(a) || new Date(0);
        const dateB = getMostRecentDate(b) || new Date(0);
        return dateB - dateA; // Sort in descending order (newest first)
      });

    // Create the new policies object
    const cleanedData = {
      lastUpdated: new Date().toISOString(),
      policies: finalPolicies
    };

    // Write the cleaned data to a new file
    fs.writeFileSync(
      CONFIG.CLEANED_FILE,
      JSON.stringify(cleanedData, null, 2),
      'utf-8'
    );

    // Print statistics
    console.log(`Original policy count: ${policiesData.policies.length}`);
    console.log(`Cleaned policy count: ${finalPolicies.length}`);
    console.log(`Removed ${policiesData.policies.length - finalPolicies.length} policies`);
    console.log('Policies have been cleaned and saved to:', CONFIG.CLEANED_FILE);

    return {
      success: true,
      originalCount: policiesData.policies.length,
      cleanedCount: finalPolicies.length,
      removedCount: policiesData.policies.length - finalPolicies.length,
      cleanedFilePath: CONFIG.CLEANED_FILE
    };
  } catch (error) {
    console.error('Error cleaning up policies:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run the cleanup if this file is executed directly
if (require.main === module) {
  cleanupPolicies();
}

// Export the cleanup function for use in other scripts
module.exports = {
  cleanupPolicies,
  isUnknownPolicy,
  isOldPolicy,
  getMostRecentDate
}; 