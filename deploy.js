#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

console.log('Deploying files for GitHub Pages...');

// Copy files from packages/main-site to root
const sourceDir = 'packages/main-site';
const allFiles = readdirSync(sourceDir);

// Filter for HTML, CSS, and JS files (excluding template files)
const filesToCopy = allFiles.filter(file => {
  const ext = extname(file).toLowerCase();
  const isWebFile = ['.html', '.css', '.js'].includes(ext);
  const isNotTemplate = !file.includes('template');
  return isWebFile && isNotTemplate;
});

console.log(`Found ${filesToCopy.length} web files to deploy:`);

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

// Copy media files to root
const mediaDir = 'media';
if (existsSync(mediaDir)) {
  const mediaFiles = readdirSync(mediaDir);
  const imageFiles = mediaFiles.filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} media files to deploy:`);

  imageFiles.forEach(file => {
    const sourcePath = resolve(mediaDir, file);
    const destPath = resolve('.', file);

    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied media/${file}`);
    } else {
      console.warn(`⚠️  Media file not found: ${sourcePath}`);
    }
  });
} else {
  console.warn('⚠️  Media directory not found');
}

console.log('🚀 Deployment files ready!');