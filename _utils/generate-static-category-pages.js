/**
 * Generate Static Category Pages
 * This script generates HTML pages for each category
 * and a category index page listing all categories.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { generatePage } = require('./components');

// Paths
const postsJsonPath = path.join(__dirname, '..', '_database', 'posts.json');
const categoriesDir = path.join(__dirname, '..', 'categories');

// Create the categories directory if it doesn't exist
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
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
          <span class="post-card-categories">
            ${post.categories.map(cat => 
              `<a href="/categories/${cat.toLowerCase()}" class="post-card-category">${cat}</a>`
            ).join(' ')}
          </span>
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

  const content = `
    <h1>Category: ${category}</h1>
    <p>Found ${categoryPosts.length} post${categoryPosts.length !== 1 ? 's' : ''} in this category</p>
    
    <div class="posts-grid">
      ${categoryPosts.map(post => createPostCard(post)).join('')}
    </div>
  `;

  return generatePage(
    `${category} - Devin Schumacher`,
    `Posts about ${category}`,
    content
  );
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

  const content = `
    <h1>Categories</h1>
    <div class="categories-grid">
      ${categoriesHtml}
    </div>
  `;

  return generatePage(
    'Categories - Devin Schumacher',
    'Browse blog posts by category',
    content
  );
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
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true });
    }

    // Get all unique categories
    const categories = getUniqueCategories(posts);
    console.log(`Found ${categories.length} unique categories: ${categories.join(', ')}`);

    // Generate category pages
    categories.forEach(category => {
      const categorySlug = category.toLowerCase();
      const categoryHtml = generateCategoryPage(category, posts);
      
      // Create a directory for the category and place an index.html file in it for clean URLs
      const categoryDirPath = path.join(categoriesDir, categorySlug);
      if (!fs.existsSync(categoryDirPath)) {
        fs.mkdirSync(categoryDirPath, { recursive: true });
      }
      
      const categoryFilePath = path.join(categoryDirPath, 'index.html');
      fs.writeFileSync(categoryFilePath, categoryHtml);
      console.log(`Generated category page for '${category}' at ${categoryFilePath}`);
    });

    // Generate categories index page
    const categoriesIndexHtml = generateCategoriesIndexPage(categories);
    const categoriesIndexPath = path.join(categoriesDir, 'index.html');
    fs.writeFileSync(categoriesIndexPath, categoriesIndexHtml);
    console.log(`Generated categories index page at ${categoriesIndexPath}`);

    console.log('Category pages generation completed!');
  } catch (error) {
    console.error('Error generating category pages:', error);
  }
};

// Run the generator
generateCategoryPages(); 