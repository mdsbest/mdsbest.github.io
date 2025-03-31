# Personal Blog Website

A simple, static blog website built with HTML, CSS, and JavaScript, organized by posts and categories.

## Overview

This repository contains the code for my personal website and blog, hosted on GitHub Pages. The website is generated using static site generator scripts that convert post data from JSON into HTML files.

## Repository Structure

- `docs/` - The main directory containing all website files (GitHub Pages deploys from this directory)
  - `assets/` - CSS, JavaScript, and image files
  - `database/` - JSON data files containing blog post content
  - `posts/` - Generated post directories, each containing an index.html file
    - `post-slug/` - Directory for each post
      - `index.html` - Post content file
  - `categories/` - Generated category directories, each containing an index.html file 
    - `category-name/` - Directory for each category
      - `index.html` - Category page content file
  - Various HTML files (index.html, about.html, contact.html, etc.)
- `utils/` - Utility scripts and tools
  - `generate-static-posts.js` - Generate static HTML files for posts
  - `generate-static-category-pages.js` - Generate static HTML files for categories
  - `config.js` - Configuration settings for the site
  - `dev-server.js` - Development server with clean URL support
  - `convert-md-to-posts.js` - Convert markdown files to posts.json entries
- `images/` - Repository-level images that can be referenced using raw GitHub URLs
- `content/` - Source content files in markdown format

## Configuration

Site configuration is managed through `utils/config.js`. This includes:

- GitHub repository information (organization, repository name, branch)
- Site details (title, description, URL)

## How to Use the Static Site Generator

The website uses two static site generator scripts to create HTML files from post data stored in `docs/database/posts.json`.

### Prerequisites

- Node.js (version 14 or later)
- pnpm (or npm)

### Installation

```bash
# Install dependencies
pnpm install
```

### Generate the Site

To generate the entire site:

```bash
pnpm build
```

This will:
- Generate individual post directories with index.html files in the `docs/posts/` directory
- Generate category directories with index.html files in the `docs/categories/` directory
- Update the posts index page (`docs/posts/index.html`) with links to all posts
- Update the main index page (`docs/index.html`) to show recent posts

You can also run individual build scripts:

```bash
# Generate only post pages
pnpm build:posts

# Generate only category pages
pnpm build:categories
```

## Adding New Posts

### From JSON

To add new blog posts directly:

1. Edit the `docs/database/posts.json` file and add a new post entry with the following format:

```json
{
  "id": 6,
  "title": "Your Post Title",
  "slug": "your-post-slug",
  "date": "2023-06-15",
  "categories": ["category1", "category2"],
  "excerpt": "A brief excerpt of your post",
  "image": "https://raw.githubusercontent.com/username/repo/branch/images/your-image.jpg",
  "content": "<p>Your HTML content here</p>"
}
```

2. Add any referenced images to the `images/` directory at the repository root
3. Run the static site generator:

```bash
pnpm build
```

### From Markdown

You can also convert markdown files to posts:

1. Place your markdown files in the `content/` directory
2. Run the conversion script:

```bash
pnpm run convert
```

3. Run the build script to generate HTML files:

```bash
pnpm build
```

## Clean URLs

This site uses "clean URLs" (no .html extension). Instead of `/posts/post-name.html`, URLs are structured as `/posts/post-name/`. This is achieved by:

1. Creating a directory for each post and category
2. Placing an `index.html` file within each directory
3. Configuring the development server to serve these files correctly

This provides better SEO and a cleaner user experience.

## Local Development

To run the website locally with clean URLs:

```bash
# Start the development server
pnpm start
```

This will:
- Start a local development server at http://localhost:3000
- Support clean URLs (e.g., /about instead of /about.html)
- Automatically serve index.html files for directory paths

## Images

Images can be stored in two locations:

1. **Repository-level images** (`/images/` directory):
   - These are referenced using GitHub raw URLs
   - URL format: `https://raw.githubusercontent.com/{org}/{repo}/refs/heads/{branch}/images/{filename}`
   - This approach works best for images that need to be consistent across all environments

2. **Assets directory images** (`/docs/assets/images/` directory):
   - These are part of the deployed site
   - Referenced with relative paths within the site

The site configuration in `utils/config.js` automatically generates the correct GitHub raw URLs based on your repository information.
