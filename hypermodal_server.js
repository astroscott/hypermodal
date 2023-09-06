const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname)));

// Get index
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Launch asset generator
app.get('/hm', function(req, res) {
  res.sendFile(path.join(__dirname, '/hm.html'));
});

app.listen(port);
console.log('root:', "\"", __dirname, "\"");
console.log('Server started at http://localhost:' + port);

const hypermodes = require(path.join(__dirname, 'rsc/hypermodes.json'));
const analysis = require(path.join(__dirname, 'rsc/analysis.json'));