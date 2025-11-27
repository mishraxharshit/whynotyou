// server/server.js - minimal Express server to serve static site and JSON API
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('tiny'));

// Serve API JSON from disk
app.get('/api/articles.json', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'api', 'articles.json'));
});
app.get('/api/courses.json', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'api', 'courses.json'));
});

// Serve static files (root project)
app.use(express.static(path.join(__dirname, '..')));

// Fallback to index.html for SPA-like navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
