/**
 * Generate Static Posts
 * This script generates static HTML files for each post in the database
 * and updates the posts/index.html page with links to all posts.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

// Paths
const postsJsonPath = path.join(__dirname, '..', '_database', 'posts.json');
const postsOutputDir = path.join(__dirname, '..', 'posts');
const postsIndexPath = path.join(postsOutputDir, 'index.html');
const mainIndexPath = path.join(__dirname, '..', 'index.html');

// GitHub raw image URL base with placeholders from config
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${config.github.organization}/${config.github.repository}/refs/heads/${config.github.branch}/images/`;

// Read the posts data
const postsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
const posts = postsData.posts;

// Sort posts by date (newest first)
const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

// Create the posts directory if it doesn't exist
if (!fs.existsSync(postsOutputDir)) {
  fs.mkdirSync(postsOutputDir, { recursive: true });
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Generate card HTML for each post
const createPostCard = (post) => {
  return `
    <article class="post-card">
      <div class="post-card-content">
        <h2 class="post-card-title">
          <a href="/posts/${post.slug}">${post.title}</a>
        </h2>
        <div class="post-card-meta">
          <span class="post-card-date">${formatDate(post.date)}</span>
          ${post.categories.map(category => `<span class="post-card-tag">${category}</span>`).join('')}
        </div>
        <p class="post-card-excerpt">${post.excerpt}</p>
        <a href="/posts/${post.slug}" class="read-more">Read More</a>
      </div>
    </article>
  `;
};

// Create HTML page for individual post
const createPostPage = (post) => {
  // Create the category links
  const categoryLinks = post.categories.map(category => 
    `<a href="/categories/${category.toLowerCase()}" class="post-category">${category}</a>`
  ).join(', ');

  // Create the HTML content
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Devin Schumacher</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <meta name="description" content="${post.excerpt}">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="/" class="site-logo">Devin Schumacher</a>
      <nav class="site-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <article class="post">
      <header class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta">
          <span class="post-date">${formatDate(post.date)}</span>
          <span class="post-categories">Categories: ${categoryLinks}</span>
        </div>
      </header>
      <div class="post-content">
        ${post.content}
      </div>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; <span id="current-year"></span> Devin Schumacher. All rights reserved.</p>
      <script>document.getElementById('current-year').textContent = new Date().getFullYear();</script>
    </div>
  </footer>
</body>
</html>
  `;
};

// Generate index page HTML for posts
const generatePostsIndexHtml = (posts) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Posts | Devin Schumacher</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <meta name="description" content="Browse all blog posts">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="/" class="site-logo">Devin Schumacher</a>
      <nav class="site-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>All Posts</h1>
    <div class="posts-grid">
      ${posts.map(post => createPostCard(post)).join('')}
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; <span id="current-year"></span> Devin Schumacher. All rights reserved.</p>
      <script>document.getElementById('current-year').textContent = new Date().getFullYear();</script>
    </div>
  </footer>
</body>
</html>
  `;
};

// Update main index HTML with recent posts
const updateMainIndexHtml = () => {
  // Read the current index.html
  let mainIndexHtml = fs.readFileSync(mainIndexPath, 'utf8');
  
  // Generate recent posts HTML (limit to 6 posts)
  const recentPostsHtml = sortedPosts.slice(0, 6)
    .map(post => createPostCard(post))
    .join('\n');
  
  // Replace the posts-container div content
  const postsContainerRegex = /<div id="posts-container" class="posts-grid">([\s\S]*?)<\/div>/;
  mainIndexHtml = mainIndexHtml.replace(postsContainerRegex, `<div id="posts-container" class="posts-grid">\n${recentPostsHtml}\n</div>`);
  
  return mainIndexHtml;
};

// Generate and write all post files
console.log('Generating post files...');
let totalGenerated = 0;

// Generate individual post files using the folder method
sortedPosts.forEach(post => {
  const postHtml = createPostPage(post);
  
  // Create a directory for each post
  const postDir = path.join(postsOutputDir, post.slug);
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }
  
  // Write the index.html file inside the post directory
  const postIndexPath = path.join(postDir, 'index.html');
  fs.writeFileSync(postIndexPath, postHtml);
  totalGenerated++;
  console.log(`Generated: ${post.slug}/index.html`);
});

// Generate posts index page
console.log('Generating posts index page...');
const postsIndexHtml = generatePostsIndexHtml(sortedPosts);
fs.writeFileSync(postsIndexPath, postsIndexHtml);
console.log('Generated posts index page');

// Update main index page
console.log('Updating main index page...');
const mainIndexHtml = updateMainIndexHtml();
fs.writeFileSync(mainIndexPath, mainIndexHtml);
console.log('Updated main index page');

console.log(`Done! Generated ${totalGenerated} post files.`); 