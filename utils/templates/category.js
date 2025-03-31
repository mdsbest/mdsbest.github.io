/**
 * Template function for generating individual category pages
 */

/**
 * Generate HTML for an individual category page
 * @param {string} category - The category name
 * @param {string} categoryDescription - Description of the category
 * @param {string} postsListHtml - HTML string of all posts in this category
 * @returns {string} Complete HTML for category page
 */
function categoryTemplate(category, categoryDescription, postsListHtml) {
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${capitalizedCategory} | Categories | Devin Schumacher</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <meta name="description" content="${capitalizedCategory} articles and tutorials by Devin Schumacher">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <a href="../" class="site-logo">Devin Schumacher</a>
            <nav class="site-nav">
                <ul>
                    <li><a href="../">Home</a></li>
                    <li><a href="../posts/">Posts</a></li>
                    <li><a href="../categories" class="active">Categories</a></li>
                    <li><a href="../about">About</a></li>
                    <li><a href="../contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="page-header">
            <h1>Category: ${capitalizedCategory}</h1>
            <p>${categoryDescription}</p>
        </section>

        <section class="posts-list">
            <div class="posts-grid">
                ${postsListHtml}
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; <span id="current-year"></span> Devin Schumacher. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Set current year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    </script>
</body>
</html>`;
}

module.exports = categoryTemplate; 