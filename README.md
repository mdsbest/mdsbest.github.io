# Devin Schumacher's Static Website

This is a static website for GitHub Pages with no build steps. The site uses vanilla HTML, CSS, and JavaScript.

## Structure

- `index.html` - Homepage
- `about.html` - About page
- `contact.html` - Contact page
- `post.html` - Post template (loads content dynamically)
- `404.html` - Error page

### Directories

- `posts/` - HTML files for each blog post
- `assets/` - Static assets
  - `css/` - Stylesheets
  - `js/` - JavaScript files
  - `images/` - Images

## How It Works

The website uses vanilla JavaScript to load blog posts dynamically:

1. Post metadata is stored in `assets/js/posts.js`
2. The homepage loads posts from this metadata
3. The post template (`post.html`) loads content from individual HTML files in the `posts/` directory

## Development

To add a new post:

1. Add the post metadata to `assets/js/posts.js`
2. Create a new HTML file in the `posts/` directory
3. Add any images to `assets/images/`

## Deployment

The site is designed to be deployed directly to GitHub Pages without any build steps. 
