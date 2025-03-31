# README 

A simple, static blog website built with HTML, CSS, and JavaScript.

## Overview

This repository contains the code for my personal website and blog, hosted on GitHub Pages. The website is generated using a static site generator script that converts post data from JSON into HTML files.

## Repository Structure

- `docs/` - The main directory containing all website files (GitHub Pages deploys from this directory)
  - `assets/` - CSS, JavaScript, and image files
  - `database/` - JSON data files containing blog post content
  - `posts/` - Generated HTML files for individual blog posts
  - `templates/` - HTML templates
  - Various HTML files (index.html, about.html, contact.html, etc.)
- `generate-static-posts.js` - Node.js script to generate static HTML files from post data

## How to Use the Static Site Generator

The website uses a static site generator script (`generate-static-posts.js`) to create HTML files from post data stored in `docs/database/posts.json`.

To generate the site:

1. Make sure you have Node.js installed
2. Run the script:

```bash
node generate-static-posts.js
```

This will:
- Generate individual HTML files for each post in the `docs/posts/` directory
- Update the posts index page (`docs/posts/index.html`) with links to all posts
- Update the main index page (`docs/index.html`) to show recent posts

## Adding New Posts

To add new blog posts:

1. Edit the `docs/database/posts.json` file and add a new post entry with the following format:

```json
{
  "id": 6,
  "title": "Your Post Title",
  "slug": "your-post-slug",
  "date": "2023-06-15",
  "categories": ["category1", "category2"],
  "excerpt": "A brief excerpt of your post",
  "image": "assets/images/your-image.jpg",
  "content": "<p>Your HTML content here</p>"
}
```

2. Add any referenced images to the `docs/assets/images/` directory
3. Run the static site generator:

```bash
node generate-static-posts.js
```

4. Commit and push your changes to deploy to GitHub Pages

## Local Development

To run the website locally:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/repository-name.git
```

2. Navigate to the docs directory:

```bash
cd repository-name/docs
```

3. Serve the files using a local server. For example, using Python:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

4. Visit `http://localhost:8000` in your browser


## Images

If you stores images in your repo like `orgname/reponame/images/*` 

- you can see them at: `
