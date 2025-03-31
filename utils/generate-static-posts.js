/**
 * Generate Static Posts
 * This script generates static HTML files for each post in the database
 * and updates the posts/index.html page with links to all posts.
 */

const fs = require('fs');
const path = require('path');

// Paths
const postsJsonPath = path.join(__dirname, 'docs', 'database', 'posts.json');
const postsOutputDir = path.join(__dirname, 'docs', 'posts');
const postsIndexPath = path.join(postsOutputDir, 'index.html');
const mainIndexPath = path.join(__dirname, 'docs', 'index.html');

// Read the posts data
const postsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
const posts = postsData.posts;

// Sort posts by date (newest first)
const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

// Create the posts directory if it doesn't exist
if (!fs.existsSync(postsOutputDir)) {
  fs.mkdirSync(postsOutputDir, { recursive: true });
}

// Generate post HTML template function
function generatePostHtml(post) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoriesHtml = post.categories
    .map(cat => `<span class="post-category">${cat}</span>`)
    .join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | Devin Schumacher</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/post.css">
    <meta name="description" content="${post.excerpt}">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:type" content="article">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <a href="../" class="site-logo">Devin Schumacher</a>
            <nav class="site-nav">
                <ul>
                    <li><a href="../">Home</a></li>
                    <li><a href="../posts/" class="active">Posts</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container post-container">
        <article class="post">
            <header class="post-header">
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <time>${date}</time>
                    <div class="post-categories">${categoriesHtml}</div>
                </div>
                <img src="../${post.image}" alt="${post.title}" class="post-featured-image">
            </header>
            
            <div class="post-content">
                ${post.content}
            </div>
        </article>

        <aside class="post-sidebar">
            <div class="related-posts">
                <h3>Recent Posts</h3>
                <ul>
                    ${generateRecentPostsHtml(post.id)}
                </ul>
            </div>
        </aside>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; <span id="current-year"></span> Devin Schumacher. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Set current year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    </script>
</body>
</html>`;
}

// Generate HTML for recent posts (excluding the current post)
function generateRecentPostsHtml(currentPostId, limit = 5) {
  return sortedPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, limit)
    .map(post => {
      const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return `<li>
        <a href="${post.slug}.html">${post.title}</a>
        <span class="post-date">${date}</span>
      </li>`;
    })
    .join('\n');
}

// Generate post card HTML for use in index pages
function generatePostCardHtml(post, isMainIndex = false) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoriesHtml = post.categories
    .map(cat => `<span class="post-card-category">${cat}</span>`)
    .join(', ');

  // Use different paths depending on whether this is for the main index or the posts index
  const postLink = isMainIndex ? `posts/${post.slug}.html` : `${post.slug}.html`;
  const imagePath = isMainIndex ? post.image : `../${post.image}`;

  return `<article class="post-card">
    <a href="${postLink}">
      <img src="${imagePath}" alt="${post.title}" class="post-card-image">
    </a>
    <div class="post-card-content">
      <h3 class="post-card-title">
        <a href="${postLink}">${post.title}</a>
      </h3>
      <div class="post-card-meta">
        <span class="post-card-date">${date}</span>
        <span class="post-card-categories">${categoriesHtml}</span>
      </div>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <a href="${postLink}" class="btn">Read More</a>
    </div>
  </article>`;
}

// Generate HTML for posts index page
function generatePostsIndexHtml() {
  const postsListHtml = sortedPosts
    .map(post => generatePostCardHtml(post, false))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Posts | Devin Schumacher</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <meta name="description" content="All blog posts by Devin Schumacher">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <a href="../" class="site-logo">Devin Schumacher</a>
            <nav class="site-nav">
                <ul>
                    <li><a href="../">Home</a></li>
                    <li><a href="." class="active">Posts</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="page-header">
            <h1>All Posts</h1>
            <p>Browse all articles and tutorials</p>
        </section>

        <section class="posts-list">
            <div class="posts-grid">
                ${postsListHtml}
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; <span id="current-year"></span> Devin Schumacher. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Set current year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    </script>
</body>
</html>`;
}

// Generate HTML for main index page with recent posts
function updateMainIndexHtml() {
  // Read the current index.html
  let mainIndexHtml = fs.readFileSync(mainIndexPath, 'utf8');
  
  // Generate recent posts HTML (limit to 6 posts)
  const recentPostsHtml = sortedPosts.slice(0, 6)
    .map(post => generatePostCardHtml(post, true))
    .join('\n');
  
  // Replace the posts-container div content
  const postsContainerRegex = /<div id="posts-container" class="posts-grid">([\s\S]*?)<\/div>/;
  mainIndexHtml = mainIndexHtml.replace(postsContainerRegex, `<div id="posts-container" class="posts-grid">\n${recentPostsHtml}\n</div>`);
  
  // Remove the script tags for loading posts via JavaScript
  const scriptRegex = /<script src="database\/database.js"><\/script>\s*<script src="assets\/js\/main.js"><\/script>/;
  mainIndexHtml = mainIndexHtml.replace(scriptRegex, `<script>
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
</script>`);
  
  return mainIndexHtml;
}

// Generate and write all post files
console.log('Generating post files...');
let totalGenerated = 0;

// Generate individual post files
sortedPosts.forEach(post => {
  const postHtml = generatePostHtml(post);
  const postPath = path.join(postsOutputDir, `${post.slug}.html`);
  
  fs.writeFileSync(postPath, postHtml);
  totalGenerated++;
  console.log(`Generated: ${post.slug}.html`);
});

// Generate posts index page
console.log('Generating posts index page...');
const postsIndexHtml = generatePostsIndexHtml();
fs.writeFileSync(postsIndexPath, postsIndexHtml);

// Update main index page
console.log('Updating main index page...');
const updatedMainIndexHtml = updateMainIndexHtml();
fs.writeFileSync(mainIndexPath, updatedMainIndexHtml);

console.log(`Done! Generated ${totalGenerated} post files.`); 