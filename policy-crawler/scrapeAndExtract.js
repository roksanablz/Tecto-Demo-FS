require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const extractStructuredData = require('./extractFromText');
const policyUrls = require('./policyUrls');

const isPdf = (url) => url.toLowerCase().endsWith('.pdf');

async function getTextFromUrl(url) {
  if (isPdf(url)) {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const data = await pdf(res.data);
    return data.text;
  } else {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    return $('body').text().replace(/\s+/g, ' ').trim().slice(0, 9000);
  }
}

const regionMap = {
  "U.S.": "United States",
  "US": "United States",
  "USA": "United States",
  "United States": "United States",
  "Europe": "European Union",
  "EU": "European Union",
  "European Union": "European Union",
  "Global": "Global"
};

function categorizeNist(name, url) {
  const n = name.toLowerCase();
  const u = url.toLowerCase();
  if (!n.includes("nist") && !u.includes("nist")) return null;
  if (n.includes("600-1") || u.includes("600-1")) return "NIST GAI Profile";
  if (n.includes("playbook") || u.includes("playbook")) return "NIST RMF Playbook";
  if (n.includes("1.0") || u.includes("100-1") || u.includes("1.0")) return "NIST RMF 1.0";
  return "NIST RMF General";
}

function normalizeDate(dateStr) {
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
}

async function run() {
  const policies = [];

  for (const url of policyUrls) {
    try {
      console.log(`Scraping: ${url}`);
      const text = await getTextFromUrl(url);
      const structured = await extractStructuredData(text, url);

      structured.source = url;
      structured.region = regionMap[structured.region] || structured.region;

      const category = categorizeNist(structured.name, url);
      if (category) structured.category = category;

      const today = new Date();
      structured.recentChanges = (structured.recentChanges || [])
        .map(rc => ({ ...rc, date: normalizeDate(rc.date) }))
        .filter(rc => new Date(rc.date) <= today);

      policies.push(structured);
      console.log(`✅ Success: ${structured.name}`);
    } catch (err) {
      console.error(`❌ Error at ${url}:`, err.message);
    }
  }

  const finalOutput = {
    lastUpdated: new Date().toISOString(),
    policies
  };

  const outputPath = path.join(__dirname, 'policies.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2));
  console.log(`✅ Saved enriched policies to ${outputPath}`);
}

run();
