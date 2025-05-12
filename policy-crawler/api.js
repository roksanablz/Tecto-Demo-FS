const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const cors = require('cors');
app.use(cors());

app.get('/api/policies', (req, res) => {
  const filePath = path.join(__dirname, '..', 'YC-data', 'yc_ai_policies_2025_sorted.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading yc_ai_policies_2025_sorted.json:', err);
      return res.status(500).json({ error: 'Failed to read policy data' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Policy API running at http://localhost:${PORT}/api/policies`);
});
