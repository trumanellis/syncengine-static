#!/usr/bin/env node
import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Copy main files to root for GitHub Pages deployment
const sourceDir = 'packages/main-site';
const filesToCopy = [
  'index.html',
  'sacred-theme.css',
  'sacred-theme.js'
];

console.log('Deploying files for GitHub Pages...');

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