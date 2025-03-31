/**
 * Shared components for HTML generation
 * This file contains reusable HTML components to ensure consistency across pages
 */

/**
 * Generate the standard header HTML
 * @returns {string} The header HTML
 */
const generateHeader = () => {
  return `
  <header class="site-header">
    <div class="container">
      <a href="/" class="site-logo">Devin Schumacher</a>
      <nav class="site-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts/">Posts</a></li>
          <li><a href="/categories/">Categories</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
  `;
};

/**
 * Generate the standard footer HTML
 * @returns {string} The footer HTML
 */
const generateFooter = () => {
  return `
  <footer class="site-footer">
    <div class="container">
      <p>&copy; <span id="current-year"></span> Devin Schumacher. All rights reserved.</p>
      <script>document.getElementById('current-year').textContent = new Date().getFullYear();</script>
    </div>
  </footer>
  `;
};

/**
 * Generate standard HTML head content
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @returns {string} The head content HTML
 */
const generateHead = (title, description) => {
  return `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <meta name="description" content="${description}">
  </head>
  `;
};

/**
 * Generate the full HTML page wrapper
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {string} content - Main content HTML
 * @returns {string} The complete HTML page
 */
const generatePage = (title, description, content) => {
  return `
<!DOCTYPE html>
<html lang="en">
${generateHead(title, description)}
<body>
  ${generateHeader()}
  <main class="container">
    ${content}
  </main>
  ${generateFooter()}
</body>
</html>
  `;
};

module.exports = {
  generateHeader,
  generateFooter,
  generateHead,
  generatePage
}; 