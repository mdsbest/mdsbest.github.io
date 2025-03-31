/**
 * Generate Static Category Pages
 * This script generates static HTML files for all categories and their individual pages
 * based on the posts in the database.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

// Paths
const postsJsonPath = path.join(__dirname, '..', 'docs', 'database', 'posts.json');
const categoriesOutputDir = path.join(__dirname, '..', 'docs', 'categories');
const categoriesIndexPath = path.join(categoriesOutputDir, 'index.html');
const categoryTemplatePath = path.join(__dirname, '..', 'docs', 'templates', 'category.html');
const categoriesIndexTemplatePath = path.join(__dirname, '..', 'docs', 'templates', 'categories-index.html');

// GitHub raw image URL base with placeholders from config
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${config.github.organization}/${config.github.repository}/refs/heads/${config.github.branch}/images/`;

// Read template files
const categoryTemplate = fs.readFileSync(categoryTemplatePath, 'utf8');
const categoriesIndexTemplate = fs.readFileSync(categoriesIndexTemplatePath, 'utf8');

// Read the posts data
const postsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
const posts = postsData.posts;

// Sort posts by date (newest first)
const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

// Create the categories directory if it doesn't exist
if (!fs.existsSync(categoriesOutputDir)) {
  fs.mkdirSync(categoriesOutputDir, { recursive: true });
}

/**
 * Create a post card HTML for displaying in category pages
 * @param {Object} post - Post object
 * @returns {string} - HTML for post card
 */
const createPostCard = (post) => {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <article class="post-card">
      <div class="post-card-content">
        <h2 class="post-card-title">
          <a href="/posts/${post.slug}">${post.title}</a>
        </h2>
        <div class="post-card-meta">
          <span class="post-card-date">${date}</span>
          ${post.categories.map(cat => `<span class="post-card-tag">${cat}</span>`).join('')}
        </div>
        <p class="post-card-excerpt">${post.excerpt}</p>
        <a href="/posts/${post.slug}" class="read-more">Read More</a>
      </div>
    </article>
  `;
};

/**
 * Generate HTML for category page
 * @param {string} category - Category name
 * @param {Array} posts - List of posts in this category
 * @returns {string} - HTML content
 */
const generateCategoryPage = (category, posts) => {
  // Filter posts that belong to this category
  const categoryPosts = posts.filter(post => 
    post.categories.map(cat => cat.toLowerCase()).includes(category.toLowerCase())
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${category} - My Blog</title>
  <link rel="stylesheet" href="/css/style.css">
  <meta name="description" content="Posts about ${category}">
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
    <h1>Category: ${category}</h1>
    <p>Found ${categoryPosts.length} post${categoryPosts.length !== 1 ? 's' : ''} in this category</p>
    
    <div class="posts-grid">
      ${categoryPosts.map(post => createPostCard(post)).join('')}
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
};

/**
 * Get all unique categories from posts
 * @param {Array} posts - List of post objects
 * @returns {Array} - List of unique categories
 */
const getUniqueCategories = (posts) => {
  const allCategories = posts.flatMap(post => post.categories);
  return [...new Set(allCategories)];
};

/**
 * Generate HTML for categories index page
 * @param {Array} categories - List of unique categories
 * @returns {string} - HTML content
 */
const generateCategoriesIndexPage = (categories) => {
  const categoriesHtml = categories.map(category => `
    <div class="category-card">
      <h2 class="category-title">
        <a href="/categories/${category.toLowerCase()}">${category}</a>
      </h2>
      <p>View all posts in this category</p>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Categories - My Blog</title>
  <link rel="stylesheet" href="/css/style.css">
  <meta name="description" content="Browse blog posts by category">
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
    <h1>Categories</h1>
    <div class="categories-grid">
      ${categoriesHtml}
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
};

/**
 * Main function to generate all category pages
 */
const generateCategoryPages = () => {
  try {
    // Read posts.json
    const postsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
    const posts = postsData.posts;

    if (!posts || !Array.isArray(posts)) {
      throw new Error('Invalid posts data. Expected an array of posts.');
    }

    console.log(`Found ${posts.length} posts to categorize`);

    // Create categories directory if it doesn't exist
    if (!fs.existsSync(categoriesOutputDir)) {
      fs.mkdirSync(categoriesOutputDir, { recursive: true });
    }

    // Get all unique categories
    const categories = getUniqueCategories(posts);
    console.log(`Found ${categories.length} unique categories: ${categories.join(', ')}`);

    // Generate category pages
    categories.forEach(category => {
      const categorySlug = category.toLowerCase();
      const categoryHtml = generateCategoryPage(category, posts);
      
      // Create a directory for the category and place an index.html file in it for clean URLs
      const categoryDirPath = path.join(categoriesOutputDir, categorySlug);
      if (!fs.existsSync(categoryDirPath)) {
        fs.mkdirSync(categoryDirPath, { recursive: true });
      }
      
      const categoryFilePath = path.join(categoryDirPath, 'index.html');
      fs.writeFileSync(categoryFilePath, categoryHtml);
      console.log(`Generated category page for '${category}' at ${categoryFilePath}`);
      
      // Also create the old-style .html file for backward compatibility
      const categoryHtmlPath = path.join(categoriesOutputDir, `${categorySlug}.html`);
      fs.writeFileSync(categoryHtmlPath, categoryHtml);
    });

    // Generate categories index page
    const categoriesIndexHtml = generateCategoriesIndexPage(categories);
    const categoriesIndexPath = path.join(categoriesOutputDir, 'index.html');
    fs.writeFileSync(categoriesIndexPath, categoriesIndexHtml);
    console.log(`Generated categories index page at ${categoriesIndexPath}`);

    console.log('Category pages generation completed!');
  } catch (error) {
    console.error('Error generating category pages:', error);
  }
};

// Run the generator
generateCategoryPages(); 