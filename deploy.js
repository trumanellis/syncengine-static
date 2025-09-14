#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

// Copy files from packages/main-site to root for GitHub Pages deployment
const sourceDir = 'packages/main-site';

console.log('Deploying files for GitHub Pages...');

// Get all files from the source directory
const allFiles = readdirSync(sourceDir);

// Filter for HTML, CSS, and JS files (excluding template files)
const filesToCopy = allFiles.filter(file => {
  const ext = extname(file).toLowerCase();
  const isWebFile = ['.html', '.css', '.js'].includes(ext);
  const isNotTemplate = !file.includes('template');
  return isWebFile && isNotTemplate;
});

console.log(`Found ${filesToCopy.length} files to deploy:`);

filesToCopy.forEach(file => {
  const sourcePath = resolve(sourceDir, file);
  const destPath = resolve('.', file);

  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.warn(`⚠️  File not found: ${sourcePath}`);
  }
});

console.log('🚀 Deployment files ready!');