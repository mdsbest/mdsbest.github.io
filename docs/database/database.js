/**
 * Blog post database
 * This file contains all blog post data (metadata and content)
 */

// Load the posts data
let database;

// Function to load the database
async function loadDatabase() {
  if (database) return database;
  
  try {
    const response = await fetch('/database/posts.json');
    if (!response.ok) {
      throw new Error(`Failed to load database: ${response.status}`);
    }
    database = await response.json();
    return database;
  } catch (error) {
    console.error('Error loading database:', error);
    // Fallback empty database
    return { posts: [] };
  }
}

// Function to get all posts
async function getAllPosts() {
  const db = await loadDatabase();
  return db.posts;
}

// Function to get a post by its slug
async function getPostBySlug(slug) {
  const db = await loadDatabase();
  return db.posts.find(post => post.slug === slug);
}

// Function to get related posts (posts in the same category)
async function getRelatedPosts(currentPostSlug, limit = 3) {
  const db = await loadDatabase();
  const currentPost = db.posts.find(post => post.slug === currentPostSlug);
  
  if (!currentPost) return [];
  
  return db.posts
    .filter(post => {
      return post.slug !== currentPostSlug && 
             post.categories.some(category => 
                 currentPost.categories.includes(category)
             );
    })
    .slice(0, limit);
}

// Function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Export the functions if using as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllPosts,
    getPostBySlug,
    getRelatedPosts,
    formatDate
  };
} 