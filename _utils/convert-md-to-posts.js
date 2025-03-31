/**
 * Convert Markdown Files to posts.json
 * This script reads markdown files from _content/company/comparisons,
 * converts them to HTML, and creates a posts.json file from them
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const config = require('./config');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Source and target paths
const markdownDir = path.join(__dirname, '..', '_content', 'company', 'comparisons');
const postsJsonPath = path.join(__dirname, '..', '_database', 'posts.json');
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
 * Download an image from a URL
 * @param {string} imageUrl - URL of the image
 * @returns {Promise<Buffer>} - Image data as buffer
 */
function downloadImageFromUrl(imageUrl) {
  return new Promise((resolve, reject) => {
    // Handle both http and https URLs
    const client = imageUrl.startsWith('https') ? https : http;
    
    client.get(imageUrl, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Failed to download image: ${res.statusCode}`));
      }

      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Generate a unique filename for an image
 * @param {string} url - Original image URL
 * @param {string} slug - Post slug for context
 * @returns {string} - Unique filename
 */
function generateImageFilename(url, slug) {
  // Extract filename from URL or generate based on slug and timestamp
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  let originalFilename = pathParts[pathParts.length - 1];
  
  // If no extension or questionable filename, create one based on slug
  if (!originalFilename || !originalFilename.includes('.')) {
    const timestamp = Date.now();
    return `${slug}-image-${timestamp}.jpg`;
  }
  
  // Clean up the filename
  originalFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '-');
  
  // Add slug prefix to avoid conflicts
  return `${slug}-${originalFilename}`;
}

/**
 * Process and save an image to the images directory
 * @param {string} imageUrl - URL of the image
 * @param {string} slug - Post slug for context
 * @returns {Promise<string>} - New image URL
 */
async function processImage(imageUrl, slug) {
  try {
    // Skip processing if already a GitHub raw URL
    if (imageUrl.includes('raw.githubusercontent.com')) {
      console.log(`Image already using GitHub raw URL: ${imageUrl}`);
      return imageUrl;
    }
    
    // Generate a unique filename
    const filename = generateImageFilename(imageUrl, slug);
    const outputPath = path.join(imagesDir, filename);
    
    // Download the image if it's a URL
    if (imageUrl.startsWith('http')) {
      console.log(`Downloading image from ${imageUrl}`);
      const imageData = await downloadImageFromUrl(imageUrl);
      fs.writeFileSync(outputPath, imageData);
      console.log(`Saved to ${outputPath}`);
    } 
    // Copy local file
    else {
      const localPath = path.join(__dirname, '..', imageUrl);
      if (fs.existsSync(localPath)) {
        fs.copyFileSync(localPath, outputPath);
        console.log(`Copied local image from ${localPath} to ${outputPath}`);
      } else {
        console.warn(`Local image not found: ${localPath}`);
        // Use a placeholder image
        return `${IMAGE_BASE_URL}placeholder.jpg`;
      }
    }
    
    // Return the new GitHub raw URL
    return `${IMAGE_BASE_URL}${filename}`;
  } catch (error) {
    console.error(`Error processing image ${imageUrl}:`, error.message);
    // Return a placeholder image on error
    return `${IMAGE_BASE_URL}placeholder.jpg`;
  }
}

/**
 * Replace all image URLs in HTML content
 * @param {string} content - HTML content with image tags
 * @param {Object} imageMap - Mapping of old URLs to new URLs
 * @returns {string} - Updated HTML content
 */
function replaceImageUrls(content, imageMap) {
  let updatedContent = content;
  
  // Replace image src attributes
  Object.entries(imageMap).forEach(([oldUrl, newUrl]) => {
    // Replace markdown image syntax
    const markdownRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    updatedContent = updatedContent.replace(markdownRegex, `![${newUrl}](${newUrl})`);
    
    // Replace HTML image tags
    const htmlRegex = new RegExp(`src=["']${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    updatedContent = updatedContent.replace(htmlRegex, `src="${newUrl}"`);
  });
  
  return updatedContent;
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
  console.log(`Found ${imageUrls.length} images in ${slug}`);
  
  // Process and download images
  const imageMap = {};
  for (const imageUrl of imageUrls) {
    const newUrl = await processImage(imageUrl, slug);
    imageMap[imageUrl] = newUrl;
  }
  
  // Generate featured image name and URL
  const featuredImageName = `${slug}-featured.jpg`;
  
  // Use first image as featured image if available, or create a placeholder
  let featuredImageUrl;
  if (imageUrls.length > 0) {
    featuredImageUrl = imageMap[imageUrls[0]];
  } else {
    featuredImageUrl = `${IMAGE_BASE_URL}${featuredImageName}`;
    // Here you could create a placeholder image if needed
  }
  
  // Replace image URLs in content
  let updatedContent = replaceImageUrls(content, imageMap);
  
  // Convert markdown to HTML
  const htmlContent = marked.parse(updatedContent, { mangle: false, headerIds: false });
  
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
    image: featuredImageUrl,
    content: htmlContent
  };
}

/**
 * Main function to convert markdown files to posts.json
 */
async function convertMarkdownToPosts() {
  try {
    // Create placeholder image if needed
    const placeholderPath = path.join(imagesDir, 'placeholder.jpg');
    if (!fs.existsSync(placeholderPath)) {
      // In a real implementation, you would generate or copy a default placeholder image
      console.log('Note: No placeholder image exists. In a real implementation, you would create one.');
    }
    
    // Read all markdown files in the directory
    const files = fs.readdirSync(markdownDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(markdownDir, file));
    
    console.log(`Found ${files.length} markdown files to process`);
    
    // Process each file
    const posts = [];
    for (let i = 0; i < files.length; i++) {
      console.log(`Processing file ${i+1}/${files.length}: ${path.basename(files[i])}`);
      const post = await processMarkdownFile(files[i], i + 1);
      posts.push(post);
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create posts.json
    const postsData = { posts };
    fs.writeFileSync(postsJsonPath, JSON.stringify(postsData, null, 2));
    
    console.log(`Successfully converted ${posts.length} markdown files to posts.json`);
    console.log(`Posts JSON saved to: ${postsJsonPath}`);
  } catch (error) {
    console.error('Error converting markdown files:', error);
  }
}

// Run the conversion
convertMarkdownToPosts(); 