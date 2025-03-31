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

// Generate post card HTML for category pages
function generatePostCardHtml(post, isCategoryPage = true) {
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Define the base paths for categories
  const categoryBase = isCategoryPage ? '' : '../categories/';
  
  const categoriesHtml = post.categories
    .map(cat => `<a href="${categoryBase}${cat.toLowerCase()}" class="post-card-category">${cat}</a>`)
    .join(', ');

  // Define the post link path
  const postLink = `../posts/${post.slug}`;
  
  return `<article class="post-card">
    <div class="post-card-content">
      <h3 class="post-card-title">
        <a href="${postLink}">${post.title}</a>
      </h3>
      <div class="post-card-meta">
        <span class="post-card-date">${date}</span>
        <span class="post-card-categories">
            ${categoriesHtml}
        </span>
      </div>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <a href="${postLink}" class="btn">Read More</a>
    </div>
  </article>`;
}

// Generate HTML for individual category page
function generateCategoryPageHtml(category, categoryPosts) {
  const postsListHtml = categoryPosts
    .map(post => generatePostCardHtml(post))
    .join('\n');

  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  let categoryDescription = '';
  switch (category.toLowerCase()) {
    case 'programming':
      categoryDescription = 'Articles about programming languages, techniques, and best practices';
      break;
    case 'sql':
      categoryDescription = 'Database management, queries, and SQL tutorials';
      break;
    case 'productivity':
      categoryDescription = 'Tools and techniques to improve your workflow and efficiency';
      break;
    case 'data':
      categoryDescription = 'Data analysis, management, and visualization';
      break;
    case 'tools':
      categoryDescription = 'Software tools and utilities for developers';
      break;
    case 'web':
      categoryDescription = 'Web development, design, and technologies';
      break;
    case 'security':
      categoryDescription = 'Web security, encryption, and best practices';
      break;
    case 'ai':
      categoryDescription = 'Artificial intelligence, machine learning, and neural networks';
      break;
    case 'audio':
      categoryDescription = 'Audio processing, generation, and technologies';
      break;
    default:
      categoryDescription = 'Articles related to ' + capitalizedCategory;
  }

  return categoryTemplate
    .replace(/{{CATEGORY_NAME}}/g, capitalizedCategory)
    .replace('{{CATEGORY_DESCRIPTION}}', categoryDescription)
    .replace('{{POSTS_LIST}}', postsListHtml);
}

// Generate HTML for categories index page
function generateCategoriesIndexHtml() {
  // Extract all unique categories
  const allCategories = [...new Set(sortedPosts.flatMap(post => post.categories))];
  
  // Generate HTML for categories with descriptions
  const categoriesHtml = allCategories.map(category => {
    const categorySlug = category.toLowerCase();
    let categoryDescription = '';
    
    switch (categorySlug) {
      case 'programming':
        categoryDescription = 'Articles about programming languages, techniques, and best practices.';
        break;
      case 'sql':
        categoryDescription = 'Database management, queries, and SQL tutorials.';
        break;
      case 'productivity':
        categoryDescription = 'Tools and techniques to improve your workflow and efficiency.';
        break;
      case 'data':
        categoryDescription = 'Data analysis, management, and visualization.';
        break;
      case 'tools':
        categoryDescription = 'Software tools and utilities for developers.';
        break;
      case 'web':
        categoryDescription = 'Web development, design, and technologies.';
        break;
      case 'security':
        categoryDescription = 'Web security, encryption, and best practices.';
        break;
      case 'ai':
        categoryDescription = 'Artificial intelligence, machine learning, and neural networks.';
        break;
      case 'audio':
        categoryDescription = 'Audio processing, generation, and technologies.';
        break;
      default:
        categoryDescription = 'Articles related to ' + category;
    }
    
    return `
                <div class="category-card">
                    <h2><a href="${categorySlug}">${category}</a></h2>
                    <p>${categoryDescription}</p>
                </div>`;
  }).join('\n                ');

  return categoriesIndexTemplate.replace('{{CATEGORIES_LIST}}', categoriesHtml);
}

// Script execution starts here
console.log('Generating category pages...');
let totalGenerated = 0;

// Extract all unique categories from posts
const categories = [...new Set(sortedPosts.flatMap(post => post.categories))];

// Generate categories index page
console.log('Generating categories index page...');
const categoriesIndexHtml = generateCategoriesIndexHtml();
fs.writeFileSync(categoriesIndexPath, categoriesIndexHtml);
totalGenerated++;
console.log('Generated categories index page');

// Generate individual category pages
categories.forEach(category => {
  const categorySlug = category.toLowerCase();
  const categoryPosts = sortedPosts.filter(post => 
    post.categories.map(cat => cat.toLowerCase()).includes(categorySlug)
  );
  
  const categoryHtml = generateCategoryPageHtml(category, categoryPosts);
  const categoryPath = path.join(categoriesOutputDir, `${categorySlug}.html`);
  
  fs.writeFileSync(categoryPath, categoryHtml);
  totalGenerated++;
  console.log(`Generated category page: ${categorySlug}.html`);
});

console.log(`Done! Generated ${totalGenerated} category pages.`); 