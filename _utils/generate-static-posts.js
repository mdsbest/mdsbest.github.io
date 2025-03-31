/**
 * Generate Static Posts
 * This script generates static HTML files for each post in the database
 * and updates the posts/index.html page with links to all posts.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { generatePage } = require('./components');

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
          <span class="post-card-categories">
            ${post.categories.map(category => 
              `<a href="/categories/${category.toLowerCase()}" class="post-card-category">${category}</a>`
            ).join(' ')}
          </span>
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
  ).join(' ');

  // Generate the post content
  const postContent = `
    <article>
      <h1>${post.title}</h1>
      <div class="meta">
        <time>${formatDate(post.date)}</time>
        <div class="categories">${categoryLinks}</div>
      </div>
      <div class="content">
        ${post.content}
      </div>
    </article>
  `;

  // Create the HTML page using the shared component
  return generatePage(
    `${post.title} | Devin Schumacher`, 
    post.excerpt, 
    postContent
  );
};

// Generate index page HTML for posts
const generatePostsIndexHtml = (posts) => {
  const content = `
    <h1>All Posts</h1>
    <div class="posts-grid">
      ${posts.map(post => createPostCard(post)).join('')}
    </div>
  `;

  return generatePage(
    'All Posts | Devin Schumacher',
    'Browse all blog posts',
    content
  );
};

// Generate HTML for main index page
const generateMainIndexHtml = (posts) => {
  const recentPosts = posts.slice(0, 6);
  
  const content = `
    <section class="intro">
      <h1>Welcome to My Blog</h1>
      <p>Thoughts on technology, programming, and more</p>
    </section>

    <section class="recent-posts">
      <h2>Recent Posts</h2>
      <div id="posts-container" class="posts-grid">
        ${recentPosts.map(post => createPostCard(post)).join('\n')}
      </div>
      <div class="view-all">
        <a href="/posts" class="btn">View All Posts</a>
      </div>
    </section>
  `;

  return generatePage(
    'Devin Schumacher',
    'Personal website and blog by Devin Schumacher',
    content
  );
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

// Generate main index page
console.log('Generating main index page...');
const mainIndexHtml = generateMainIndexHtml(sortedPosts);
fs.writeFileSync(mainIndexPath, mainIndexHtml);
console.log('Generated main index page');

console.log(`Done! Generated ${totalGenerated} post files.`); 