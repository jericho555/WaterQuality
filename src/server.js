// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const port = 8051;

app.use(express.static('public'));
const filePath = 'data.json';


fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

    app.get('/data', (req, res) => {
  // Process and retrieve the data from json file
  try {
    // Parse the JSON data
     const data = JSON.parse(data);

    return res.json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
