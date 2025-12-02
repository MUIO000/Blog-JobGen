/**
 * File Copy Script
 * Used to copy Blog-related files from the main project to the standalone package
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory (assuming the script is in the blog-package directory)
const projectRoot = path.resolve(__dirname, '..');
const blogPackageRoot = __dirname;

// Files and directories to copy
const filesToCopy = [
  {
    from: 'src/pages/Blog',
    to: 'src/pages/Blog',
    type: 'directory'
  },
  {
    from: 'src/data/blogData.json',
    to: 'src/data/blogData.json',
    type: 'file'
  },
  {
    from: 'public/jobgenLogo.png',
    to: 'public/jobgenLogo.png',
    type: 'file'
  }
];

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  
  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy file
  fs.copyFileSync(src, dest);
  console.log(`✓ Copied: ${path.relative(blogPackageRoot, dest)}`);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function main() {
  console.log('🚀 Starting to copy Blog files...\n');
  
  for (const item of filesToCopy) {
    const srcPath = path.join(projectRoot, item.from);
    const destPath = path.join(blogPackageRoot, item.to);
    
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  Source file not found: ${srcPath}`);
      continue;
    }
    
    if (item.type === 'directory') {
      console.log(`📁 Copying directory: ${item.from}`);
      copyDirectory(srcPath, destPath);
    } else {
      console.log(`📄 Copying file: ${item.from}`);
      copyFile(srcPath, destPath);
    }
  }
  
  console.log('\n✅ File copy complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Check if the copied files are correct');
  console.log('2. Run npm install to install dependencies');
  console.log('3. Run npm run dev to start the development server');
}

main();

