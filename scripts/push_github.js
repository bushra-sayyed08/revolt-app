const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GH_TOKEN;
const OWNER = 'bushra-sayyed08';
const REPO = 'revolt-app';

async function fetchGH(endpoint, options = {}) {
  const url = `https://api.github.com${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ReVolt-Hackathon-Uploader',
      ...(options.headers || {})
    }
  });
  return res;
}

// Recursively get files
function getFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

async function main() {
  console.log(`Checking if repo ${OWNER}/${REPO} exists...`);
  let checkRes = await fetchGH(`/repos/${OWNER}/${REPO}`);
  
  if (checkRes.status === 404) {
    console.log(`Creating public repo ${OWNER}/${REPO}...`);
    const createRes = await fetchGH('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name: REPO,
        description: 'ReVolt: AI-Powered DIY Repair & Zero E-Waste Engine | Green Shift Hacks 2026',
        private: false,
        auto_init: true
      })
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('Failed to create repo:', err);
      process.exit(1);
    }
    console.log('Repo created successfully. Waiting 3s for initialization...');
    await new Promise(r => setTimeout(r, 3000));
  } else {
    console.log('Repo already exists.');
  }

  // Get default branch commit
  const repoDataRes = await fetchGH(`/repos/${OWNER}/${REPO}`);
  const repoData = await repoDataRes.json();
  const defaultBranch = repoData.default_branch || 'main';
  console.log(`Default branch is ${defaultBranch}`);

  const refRes = await fetchGH(`/repos/${OWNER}/${REPO}/git/refs/heads/${defaultBranch}`);
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  const commitRes = await fetchGH(`/repos/${OWNER}/${REPO}/git/commits/${latestCommitSha}`);
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  console.log(`Base commit: ${latestCommitSha}, Base tree: ${baseTreeSha}`);

  // Collect files
  const revoltDir = path.resolve(__dirname, '..');
  const files = getFiles(revoltDir);
  console.log(`Found ${files.length} project files to upload...`);

  // Create blobs in batches
  const treeItems = [];
  for (const f of files) {
    const content = fs.readFileSync(f.fullPath);
    const isBinary = /\.(png|jpg|jpeg|gif|ico|webp)$/i.test(f.relPath);
    
    const blobRes = await fetchGH(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content: content.toString(isBinary ? 'base64' : 'utf8'),
        encoding: isBinary ? 'base64' : 'utf-8'
      })
    });

    if (!blobRes.ok) {
      console.error(`Error uploading blob for ${f.relPath}:`, await blobRes.text());
      continue;
    }

    const blobData = await blobRes.json();
    treeItems.push({
      path: f.relPath,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    });
    process.stdout.write('.');
  }
  console.log('\nAll blobs created. Creating git tree...');

  const treeRes = await fetchGH(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems
    })
  });
  const treeData = await treeRes.json();
  if (!treeRes.ok) {
    console.error('Failed to create tree:', treeData);
    process.exit(1);
  }

  console.log('Creating commit...');
  const newCommitRes = await fetchGH(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: 'feat: Initial commit of ReVolt - AI Right-to-Repair & Zero E-Waste Engine',
      tree: treeData.sha,
      parents: [latestCommitSha]
    })
  });
  const newCommitData = await newCommitRes.json();

  console.log('Updating branch reference...');
  const updateRefRes = await fetchGH(`/repos/${OWNER}/${REPO}/git/refs/heads/${defaultBranch}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: newCommitData.sha,
      force: true
    })
  });

  if (updateRefRes.ok) {
    console.log(`\n🎉 SUCCESS! Pushed to https://github.com/${OWNER}/${REPO}`);
  } else {
    console.error('Failed to update branch:', await updateRefRes.text());
  }
}

main().catch(console.error);
