/**
 * Convert Markdown Files to posts.json
 * This script reads markdown files from content/company/comparisons,
 * converts them to HTML, and creates a posts.json file from them
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const config = require('./config');

// Source and target paths
const markdownDir = path.join(__dirname, '..', 'content', 'company', 'comparisons');
const postsJsonPath = path.join(__dirname, '..', 'docs', 'database', 'posts.json');
const imagesDir = path.join(__dirname, '..', 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// GitHub raw image URL base with placeholders from config
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${config.github.organization}/${config.github.repository}/refs/heads/${config.github.branch}/images/`;

// Categories mapping
const categoriesMap = {
  'Reviews': ['reviews', 'comparisons'],
  'Web Dev': ['web', 'development'],
  'Business': ['business', 'productivity'],
  'Technology': ['tech', 'tools']
};

/**
 * Extract image references from markdown content
 * @param {string} content - Markdown content
 * @returns {string[]} - Array of image URLs
 */
function extractImageUrls(content) {
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  const images = [];
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  
  return images;
}

/**
 * Download and save images locally
 * @param {string} imageUrl - URL of the image
 * @param {string} filename - Name to save the image as
 * @returns {Promise<string>} - Path to the saved image
 */
async function downloadImage(imageUrl, filename) {
  // This is a placeholder - in a real implementation, 
  // you would use fetch or another HTTP client to download the image
  console.log(`Would download ${imageUrl} to ${filename}`);
  return `${IMAGE_BASE_URL}${filename}`;
}

/**
 * Process a markdown file and convert it to a post object
 * @param {string} filePath - Path to the markdown file
 * @param {number} id - Unique ID for the post
 * @returns {Object} - Post object
 */
async function processMarkdownFile(filePath, id) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  // Extract slug, removing leading and trailing slashes
  let slug = data.slug || path.basename(filePath, '.md');
  slug = slug.replace(/^\/|\/$/g, '');
  slug = slug.split('/').pop(); // Get the last part of the path
  
  // Extract image URLs
  const imageUrls = extractImageUrls(content);
  
  // Generate an image name based on the slug
  const imageName = `${slug}-featured.jpg`;
  
  // Process content - convert markdown to HTML
  const htmlContent = marked.parse(content, { mangle: false, headerIds: false });
  
  // Map categories
  let categories = [];
  if (data.category && categoriesMap[data.category]) {
    categories = [...categoriesMap[data.category]];
  }
  if (data.tags && Array.isArray(data.tags)) {
    categories = [...new Set([...categories, ...data.tags])];
  }
  
  // Create post object
  return {
    id,
    title: data.title || path.basename(filePath, '.md').replace(/-/g, ' '),
    slug,
    date: data.date || new Date().toISOString().split('T')[0],
    categories,
    excerpt: data.excerpt || `${htmlContent.replace(/<[^>]*>/g, ' ').substring(0, 150)}...`,
    image: `${imageName}`,
    content: htmlContent
  };
}

/**
 * Main function to convert markdown files to posts.json
 */
async function convertMarkdownToPosts() {
  try {
    // Read all markdown files in the directory
    const files = fs.readdirSync(markdownDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(markdownDir, file));
    
    // Process each file
    const posts = [];
    for (let i = 0; i < files.length; i++) {
      const post = await processMarkdownFile(files[i], i + 1);
      posts.push(post);
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create posts.json
    const postsData = { posts };
    fs.writeFileSync(postsJsonPath, JSON.stringify(postsData, null, 2));
    
    console.log(`Successfully converted ${posts.length} markdown files to posts.json`);
  } catch (error) {
    console.error('Error converting markdown files:', error);
  }
}

// Run the conversion
convertMarkdownToPosts(); 