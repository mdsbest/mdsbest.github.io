/**
 * Post Loader JavaScript
 * Handles loading and displaying individual post content
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a post page
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');
    const relatedPostsList = document.getElementById('related-posts-list');
    
    if (postTitle && postContent) {
        const slug = getUrlParameter('slug');
        
        if (slug) {
            loadPost(slug);
        } else {
            // No slug parameter, redirect to homepage
            window.location.href = '/docs/';
        }
    }
});

/**
 * Load a post by its slug
 * @param {string} slug - Post slug
 */
async function loadPost(slug) {
    try {
        const post = await getPostBySlug(slug);
        
        if (!post) {
            // Post not found, redirect to 404
            window.location.href = '/docs/404.html';
            return;
        }
        
        // Update page metadata
        document.title = `${post.title} | Devin Schumacher`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
        document.querySelector('meta[property="og:title"]').setAttribute('content', post.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', post.excerpt);
        
        // Update post header
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-date').textContent = formatDate(post.date);
        document.getElementById('post-categories').textContent = post.categories.join(', ');
        
        // Set post content directly from the database
        document.getElementById('post-content').innerHTML = post.content;
        
        // Load related posts
        loadRelatedPosts(slug);
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = `
            <p class="error">Failed to load post content. Please try again later.</p>
        `;
    }
}

/**
 * Load related posts
 * @param {string} currentPostSlug - Current post slug
 */
async function loadRelatedPosts(currentPostSlug) {
    try {
        const relatedPostsList = document.getElementById('related-posts-list');
        const relatedPosts = await getRelatedPosts(currentPostSlug);
        
        if (relatedPosts.length === 0) {
            relatedPostsList.innerHTML = '<li>No related posts found.</li>';
            return;
        }
        
        relatedPostsList.innerHTML = '';
        
        relatedPosts.forEach(post => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="/docs/post.html?slug=${post.slug}" class="related-post-title">${post.title}</a>
                <span class="related-post-date">${formatDate(post.date)}</span>
            `;
            relatedPostsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading related posts:', error);
        document.getElementById('related-posts-list').innerHTML = `
            <li class="error">Failed to load related posts.</li>
        `;
    }
} 
