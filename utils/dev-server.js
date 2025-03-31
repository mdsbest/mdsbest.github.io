/**
 * Simple development server with URL rewriting
 * Run with: node utils/dev-server.js
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`Starting development server for ${config.site.title}`);
console.log(`Repository: ${config.github.organization}/${config.github.repository}`);

// Directory to serve static files from
const staticDir = path.join(__dirname, '..', 'docs');

// First, serve static assets directly
app.use(express.static(staticDir));

// Handle clean URLs - for routes without file extensions
app.get('*', (req, res, next) => {
  let url = req.path;
  
  // If the URL already ends with .html or has a file extension, continue to the next middleware
  if (url.match(/\.\w+$/) || url === '/') {
    return next();
  }
  
  // Check if we should serve an HTML file for this path
  const htmlPath = path.join(staticDir, `${url}.html`);
  const indexPath = path.join(staticDir, url, 'index.html');
  
  // Try to serve the HTML file or index.html in the directory
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// Fallback to index.html for any unmatched paths
app.use((req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving static files from: ${staticDir}`);
}); 