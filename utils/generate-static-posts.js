/**
 * Generate Static Posts
 * This script generates static HTML files for each post in the database
 * and updates the posts/index.html page with links to all posts.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

// Paths
const postsJsonPath = path.join(__dirname, '..', 'docs', 'database', 'posts.json');
const postsOutputDir = path.join(__dirname, '..', 'docs', 'posts');
const postsIndexPath = path.join(postsOutputDir, 'index.html');
const mainIndexPath = path.join(__dirname, '..', 'docs', 'index.html');

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
    `<a href="/categories/${category}">${category}</a>`
  ).join(', ');

  // Create the HTML content
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
  <link rel="stylesheet" href="/css/style.css">
  <meta name="description" content="${post.excerpt}">
</head>
<body>
  <header>
    <div class="container">
      <h1 class="site-title"><a href="/">My Blog</a></h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/about">About</a></li>
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

  <footer>
    <div class="container">
      <p>&copy; <span id="current-year"></span> My Blog. All rights reserved.</p>
      <script>document.getElementById('current-year').textContent = new Date().getFullYear();</script>
    </div>
  </footer>
</body>
</html>
  `;
};

/**
 * Creates posts directory and generated HTML files for each post
 * @param {Array} posts - List of post objects from posts.json
 */
const generatePostsFiles = (posts) => {
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsOutputDir)) {
    fs.mkdirSync(postsOutputDir, { recursive: true });
  }

  // Generate individual post pages
  posts.forEach(post => {
    const postHtml = createPostPage(post);
    const postPath = path.join(postsOutputDir, `${post.slug}.html`);
    fs.writeFileSync(postPath, postHtml);
    console.log(`Created: ${postPath}`);
    
    // Also create a directory with index.html for clean URLs
    const postDir = path.join(postsOutputDir, post.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    
    const postIndexPath = path.join(postDir, 'index.html');
    fs.writeFileSync(postIndexPath, postHtml);
    console.log(`Created: ${postIndexPath} (for clean URL)`);
  });
  
  // Generate index page for posts
  const postsIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Posts</title>
  <link rel="stylesheet" href="/css/style.css">
  <meta name="description" content="Browse all blog posts">
</head>
<body>
  <header>
    <div class="container">
      <h1 class="site-title"><a href="/">My Blog</a></h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/about">About</a></li>
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

  <footer>
    <div class="container">
      <p>&copy; <span id="current-year"></span> My Blog. All rights reserved.</p>
      <script>document.getElementById('current-year').textContent = new Date().getFullYear();</script>
    </div>
  </footer>
</body>
</html>
  `;
  
  const postsIndexPath = path.join(postsOutputDir, 'index.html');
  fs.writeFileSync(postsIndexPath, postsIndexHtml);
  console.log(`Created: ${postsIndexPath}`);
};

// Generate and write all post files
console.log('Generating post files...');
let totalGenerated = 0;

// Generate individual post files
sortedPosts.forEach(post => {
  const postHtml = createPostPage(post);
  const postPath = path.join(postsOutputDir, `${post.slug}.html`);
  
  fs.writeFileSync(postPath, postHtml);
  totalGenerated++;
  console.log(`Generated: ${post.slug}.html`);
});

// Generate posts index page
console.log('Generating posts index page...');
const postsIndexHtml = generatePostsFiles(sortedPosts);
fs.writeFileSync(postsIndexPath, postsIndexHtml);

// Update main index page
console.log('Updating main index page...');
const mainIndexHtml = updateMainIndexHtml();
fs.writeFileSync(mainIndexPath, mainIndexHtml);

console.log(`Done! Generated ${totalGenerated} post files.`); 