// server.js
const dash = require('dash-core-components');
const html = require('html');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 8051;

app.use(express.static('public'));
const filePath = '../data.json';


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

app = dash.Dash(__name__)
app.layout = html.Div("display.html",status="update")
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
