/**
 * Simple development server with URL rewriting
 * Run with: node utils/dev-server.js
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const app = express();
const PORT = 8080;

console.log(`Starting development server for ${config.site.title}`);
console.log(`Repository: ${config.github.organization}/${config.github.repository}`);

// Serve static assets
app.use(express.static(path.join(__dirname, '..', 'docs')));

// Handle clean URLs by rewriting them to .html files
app.get('*', (req, res, next) => {
  let url = req.path;
  
  // Skip if URL already has an extension
  if (path.extname(url) !== '') {
    return next();
  }
  
  // Handle trailing slash (e.g., /categories/ -> /categories/index.html)
  if (url.endsWith('/')) {
    const htmlPath = path.join(__dirname, '..', 'docs', url, 'index.html');
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  
  // Try adding .html extension (e.g., /about -> /about.html)
  const htmlPath = path.join(__dirname, '..', 'docs', `${url}.html`);
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  
  // Try finding an index.html in the directory (e.g., /categories -> /categories/index.html)
  const indexPath = path.join(__dirname, '..', 'docs', url, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  next();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving from: ${path.join(__dirname, '..', 'docs')}`);
  console.log(`To view the site, open http://localhost:${PORT} in your browser`);
}); 