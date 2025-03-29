/**
 * Main JavaScript file
 * Contains common functionality for the site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Handle homepage post loading
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        loadRecentPosts();
    }
});

/**
 * Load recent posts on the homepage
 */
async function loadRecentPosts() {
    try {
        const postsContainer = document.getElementById('posts-container');
        const allPosts = await getAllPosts();
        
        // Sort posts by date (newest first)
        const sortedPosts = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display the posts
        sortedPosts.forEach(post => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-container').innerHTML = `
            <p class="error">Failed to load posts. Please try again later.</p>
        `;
    }
}

/**
 * Create a post card element
 * @param {Object} post - Post object
 * @returns {HTMLElement} - Post card element
 */
function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';
    
    const formattedDate = formatDate(post.date);
    const categoriesHtml = post.categories.map(cat => `<span class="post-card-category">${cat}</span>`).join(', ');
    
    card.innerHTML = `
        <a href="/docs/post.html?slug=${post.slug}">
            <img src="${post.image}" alt="${post.title}" class="post-card-image">
        </a>
        <div class="post-card-content">
            <h3 class="post-card-title">
                <a href="/docs/post.html?slug=${post.slug}">${post.title}</a>
            </h3>
            <div class="post-card-meta">
                <span class="post-card-date">${formattedDate}</span>
                <span class="post-card-categories">${categoriesHtml}</span>
            </div>
            <p class="post-card-excerpt">${post.excerpt}</p>
            <a href="/docs/post.html?slug=${post.slug}" class="btn">Read More</a>
        </div>
    `;
    
    return card;
}

/**
 * Get URL parameters
 * @param {string} param - Parameter name
 * @returns {string|null} - Parameter value
 */
function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
} 
