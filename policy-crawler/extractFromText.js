const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractStructuredData(text, url) {
  const prompt = `
You are an AI policy analyst. Read the document below and return a structured JSON object summarizing key metadata.

Only use content directly found in the text. Do your best to fill in the information for a field but if it is missing or unclear, use "unknown".

---
Schema:
{
  "name": string,
  "region": "United States" | "European Union" | "Global",
  "status": "Enacted" | "In Progress" | "In Development",
  "progress": number, // 0–100
  "recentChanges": [{ "date": string, "change": string }], // one sentence
  "futureMilestones": [{ "date": string, "event": string }], // one sentence
  "leader": {
    "name": string,
    "role": string,
    "organization": string
  },
  "impact": "High" | "Medium" | "Low"
}

---
Example:
{
  "name": "Artificial Intelligence Act",
  "region": "European Union",
  "status": "Enacted",
  "progress": 100,
  "recentChanges": [
    { "date": "2024-03-13", "change": "Passed the European Parliament" },
    { "date": "2024-05-21", "change": "Approved by the EU Council" },
    { "date": "2024-08-01", "change": "Act came into force" }
  ],
  "futureMilestones": [
    { "date": "2025-08-01", "event": "Phase 1 enforcement begins" },
    { "date": "2026-01-01", "event": "Compliance required for high-risk AI systems" }
  ],
  "leader": {
    "name": "European Commission",
    "role": "Proposer",
    "organization": "European Union"
  },
  "impact": "High"
}

---
Instructions:
- Do not infer or invent missing information.
- Return only a JSON object wrapped in triple backticks. Do not include text before or after. 
- Only include dates that have already occurred (i.e. before today) in "recentChanges".
- Only include future or upcoming events in "futureMilestones".
- Keep all "change" and "event" descriptions concise: no more than 12 words.
- Focus on the essential action or outcome only.
- Remove redundant or explanatory phrases (e.g. “which will...”, “in order to...”).


---
Document source: ${url}

Document text:
"""${text.slice(0, 9000)}"""
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const raw = response.choices[0].message.content;
  const match = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);

  if (!match) {
    console.error("Raw LLM output (no JSON found):", raw.slice(0, 300));
    throw new Error(`No valid JSON block found in LLM response for URL: ${url}`);
  }

  try {
    return JSON.parse(match[1]);
  } catch (err) {
    console.error("Raw JSON block that failed to parse:", match[1].slice(0, 300));
    throw new Error(`Failed to parse JSON from LLM for URL: ${url}`);
  }
}

module.exports = extractStructuredData;
