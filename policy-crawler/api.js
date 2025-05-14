const path = require('path');
const file_name = 'FS_ai_policies_2025_sorted.json';
const file_path = path.join(__dirname, '..', 'policy-data', file_name);
const express = require('express');
const fs = require('fs');

const app = express();

const cors = require('cors');
app.use(cors());

app.get('/api/policies', (req, res) => {
  fs.readFile(file_path, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading ${file_name}:', err);
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
