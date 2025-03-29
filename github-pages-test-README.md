# GitHub Pages Scale Testing

This project contains scripts for testing the scale limitations of GitHub Pages by generating a large number of dummy HTML files.

## Scripts

### 1. `generate-test-posts.js`

This script generates 1,000 dummy HTML files to test GitHub Pages on a small scale.

```bash
node generate-test-posts.js
```

This will:
- Create 1,000 individual HTML files (dummy-post-1.html through dummy-post-1000.html)
- Generate a dummy-index.html file with links to all the post files
- Process files in batches of 100 to avoid memory issues

### 2. `generate-dummy-posts.js`

This script generates 100,000 dummy HTML files to test GitHub Pages at scale.

⚠️ **Warning:** This script will create a large number of files and may take significant time and resources to run. Only use on systems with adequate storage and memory.

```bash
node generate-dummy-posts.js
```

This will:
- Create 100,000 individual HTML files (dummy-post-1.html through dummy-post-100000.html)
- Generate a main dummy-index.html file that links to separate index pages
- Create 100 separate index pages, each containing links to 1,000 posts
- Process files in batches of 1,000 to avoid memory issues

## Output

All files are generated in the `docs/` directory:

- `docs/dummy-post-*.html` - Individual post files
- `docs/dummy-index.html` - Main index for the test posts
- `docs/index-*.html` - Secondary index pages (for the 100k version)

## Purpose

This project helps test:

1. GitHub Pages size limits
2. Build/deployment time with large numbers of files
3. Navigation and performance with a large static site
4. Browser performance with pages containing many links

## GitHub Pages Limitations

According to GitHub documentation, GitHub Pages sites have the following limitations:

- GitHub Pages source repositories have a recommended limit of 1GB
- Published GitHub Pages sites may be no larger than 1GB
- GitHub Pages sites have a soft bandwidth limit of 100GB per month
- GitHub Pages sites have a soft limit of 10 builds per hour

This test helps determine if there are additional practical limitations beyond these documented limits. 