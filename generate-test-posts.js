const fs = require('fs');
const path = require('path');

// Configuration - reduced number for testing
const TOTAL_POSTS = 1000;
const BATCH_SIZE = 100; // Smaller batch size for the test
const DOCS_DIR = path.join(__dirname, 'docs');

// Create docs directory if it doesn't exist
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR);
}

// Simple HTML template for each post
function generateDummyHtml(index) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dummy Post ${index}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .post-header {
      margin-bottom: 30px;
    }
    .post-title {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .post-date {
      color: #666;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="post-header">
    <h1 class="post-title">Dummy Post ${index}</h1>
    <div class="post-date">Published on: 2023-03-${(index % 28) + 1}</div>
  </div>
  <div class="post-content">
    <p>This is dummy post number ${index} for testing GitHub Pages limits.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.</p>
    <p>Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.</p>
    <h2>Section ${index % 5 + 1}</h2>
    <p>Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
    <p>Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
</body>
</html>`;
}

// Function to generate posts in batches
async function generatePosts() {
  console.log(`Starting to generate ${TOTAL_POSTS} dummy posts...`);
  const startTime = Date.now();
  
  for (let batch = 0; batch < TOTAL_POSTS / BATCH_SIZE; batch++) {
    const batchStart = batch * BATCH_SIZE;
    const batchEnd = Math.min((batch + 1) * BATCH_SIZE, TOTAL_POSTS);
    
    console.log(`Generating batch ${batch + 1}/${Math.ceil(TOTAL_POSTS / BATCH_SIZE)} (posts ${batchStart + 1}-${batchEnd})...`);
    
    const batchPromises = [];
    
    for (let i = batchStart; i < batchEnd; i++) {
      const html = generateDummyHtml(i + 1);
      const filePath = path.join(DOCS_DIR, `dummy-post-${i + 1}.html`);
      
      batchPromises.push(
        new Promise((resolve, reject) => {
          fs.writeFile(filePath, html, (err) => {
            if (err) reject(err);
            else resolve();
          });
        })
      );
    }
    
    // Wait for all files in this batch to be written
    await Promise.all(batchPromises);
    
    // Log progress
    const progress = Math.floor((batchEnd / TOTAL_POSTS) * 100);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Progress: ${progress}% complete (${elapsed}s elapsed)`);
  }
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Successfully generated ${TOTAL_POSTS} dummy posts in ${totalTime} seconds`);

  // Generate index file that links to all posts
  await generateIndex();
}

// Generate index.html file with links to all posts
async function generateIndex() {
  console.log('Generating index.html with links to all posts...');
  
  let indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dummy Posts Index</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      margin-bottom: 30px;
    }
    .post-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .post-link {
      display: block;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-decoration: none;
      color: #333;
    }
    .post-link:hover {
      background-color: #f5f5f5;
    }
  </style>
</head>
<body>
  <h1>Dummy Posts Index (${TOTAL_POSTS} Posts)</h1>
  <p>This is a test page with links to ${TOTAL_POSTS} dummy posts, created to test GitHub Pages limits.</p>
  
  <div class="post-list">`;

  // Add links to all posts (since we're only generating 1000)
  for (let i = 0; i < TOTAL_POSTS; i++) {
    indexHtml += `
    <a href="dummy-post-${i + 1}.html" class="post-link">Dummy Post ${i + 1}</a>`;
  }

  indexHtml += `
  </div>
</body>
</html>`;

  // Write index.html
  await fs.promises.writeFile(path.join(DOCS_DIR, 'dummy-index.html'), indexHtml);
  
  console.log('Successfully generated index file');
}

// Execute the script
generatePosts().catch(err => {
  console.error('Error generating posts:', err);
  process.exit(1);
}); 