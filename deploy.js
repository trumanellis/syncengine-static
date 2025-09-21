#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync, mkdirSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';

console.log('Deploying files for GitHub Pages...');

// Ensure docs directory exists
const docsDir = 'docs';
if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
}

// Copy files from packages/main-site to root and docs
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
  const rootDestPath = resolve('.', file);
  const docsDestPath = resolve(docsDir, file);

  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, rootDestPath);
    copyFileSync(sourcePath, docsDestPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.warn(`⚠️  File not found: ${sourcePath}`);
  }
});

// Copy media files to root and docs
const mediaDir = 'media';
const docsMediaDir = resolve(docsDir, 'media');
if (!existsSync(docsMediaDir)) {
  mkdirSync(docsMediaDir, { recursive: true });
}

if (existsSync(mediaDir)) {
  const mediaFiles = readdirSync(mediaDir);
  const imageFiles = mediaFiles.filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
  });

  console.log(`Found ${imageFiles.length} media files to deploy:`);

  imageFiles.forEach(file => {
    const sourcePath = resolve(mediaDir, file);
    const rootDestPath = resolve('.', file);
    const docsDestPath = resolve(docsMediaDir, file);

    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, rootDestPath);
      copyFileSync(sourcePath, docsDestPath);
      console.log(`✅ Copied media/${file}`);
    } else {
      console.warn(`⚠️  Media file not found: ${sourcePath}`);
    }
  });
} else {
  console.warn('⚠️  Media directory not found');
}

console.log('🚀 Deployment files ready!');

// Validation checks
console.log('\n🔍 Running deployment validations...');

// Check for test modal (should be removed)
try {
  const tractorContent = readFileSync('tractor.html', 'utf8');
  if (tractorContent.includes('Test Modal') || tractorContent.includes('Test button')) {
    console.error('❌ VALIDATION FAILED: Test modal still present in tractor.html');
    process.exit(1);
  } else {
    console.log('✅ Test modal removed from tractor.html');
  }
} catch (error) {
  console.error('❌ Could not validate tractor.html:', error.message);
  process.exit(1);
}

// Check Eden Game button link
try {
  const edenGameContent = readFileSync('eden-game.html', 'utf8');
  if (edenGameContent.includes('href="/agua-lila.html"') && edenGameContent.includes('Start with Água Lila')) {
    console.log('✅ Eden Game button links correctly');
  } else {
    console.error('❌ VALIDATION FAILED: Eden Game button link incorrect');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Could not validate eden-game.html:', error.message);
  process.exit(1);
}

console.log('✅ All validations passed!');