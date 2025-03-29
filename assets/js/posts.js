/**
 * Blog post data
 * This file contains metadata for all blog posts
 */

const posts = [
    {
        id: 1,
        title: "SQL Show - How to View Tables in MySQL, Postgres, MariaDB",
        slug: "sql-show",
        date: "2023-01-09",
        categories: ["programming", "sql"],
        excerpt: "Learn how to view and list database tables in MySQL, Postgres, or MariaDB databases from the command line.",
        content: "posts/sql-show.html",
        image: "/assets/images/sql-show.jpg"
    },
    {
        id: 2,
        title: "How to Combine/Merge Multiple CSV or Excel Files for Mac & PC",
        slug: "how-to-combine-merge-multiple-csv-or-excel-files-for-mac-pc",
        date: "2023-02-15", 
        categories: ["productivity", "data"],
        excerpt: "A step-by-step guide on how to combine multiple CSV or Excel files on both Mac and PC.",
        content: "posts/how-to-combine-merge-multiple-csv-or-excel-files-for-mac-pc.html",
        image: "/assets/images/combine-csv.jpg"
    },
    {
        id: 3,
        title: "How to Disable Prettier Formatting for Individual Files or Folders",
        slug: "how-to-disable-prettier-formatting-for-individual-files-or-folders",
        date: "2023-03-10",
        categories: ["programming", "tools"],
        excerpt: "Learn how to selectively disable Prettier formatting for specific files or folders in your project.",
        content: "posts/how-to-disable-prettier-formatting-for-individual-files-or-folders.html",
        image: "/assets/images/prettier.jpg"
    },
    {
        id: 4,
        title: "HTTP vs HTTPS - What's the Difference?",
        slug: "http-vs-https",
        date: "2023-04-05",
        categories: ["web", "security"],
        excerpt: "Understand the key differences between HTTP and HTTPS and why HTTPS is crucial for modern websites.",
        content: "posts/http-vs-https.html",
        image: "/assets/images/http-vs-https.jpg"
    },
    {
        id: 5,
        title: "Audio Diffusion AI - The Future of Sound Generation",
        slug: "audio-diffusion-ai",
        date: "2023-05-20",
        categories: ["ai", "audio"],
        excerpt: "Exploring the cutting-edge technology behind audio diffusion AI and its applications.",
        content: "posts/audio-diffusion-ai.html",
        image: "/assets/images/audio-ai.jpg"
    }
];

// Function to get all posts
function getAllPosts() {
    return posts;
}

// Function to get a post by its slug
function getPostBySlug(slug) {
    return posts.find(post => post.slug === slug);
}

// Function to get related posts (posts in the same category)
function getRelatedPosts(currentPostSlug, limit = 3) {
    const currentPost = getPostBySlug(currentPostSlug);
    if (!currentPost) return [];
    
    return posts
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
