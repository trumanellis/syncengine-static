#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { resolve, extname } from 'path';

console.log('🔄 Syncing changes from root back to source...');

// Ensure packages/main-site exists
const sourceDir = 'packages/main-site';
if (!existsSync(sourceDir)) {
  mkdirSync(sourceDir, { recursive: true });
}

// Files to sync back to source
const rootFiles = readdirSync('.').filter(file => {
  const ext = extname(file).toLowerCase();
  const isWebFile = ['.html', '.css', '.js'].includes(ext);
  const isNotNodeModule = !file.startsWith('node_modules');
  const isNotGit = !file.startsWith('.git');
  return isWebFile && isNotNodeModule && isNotGit;
});

console.log(`Found ${rootFiles.length} files to sync back to source:`);

rootFiles.forEach(file => {
  const sourcePath = resolve('.', file);
  const destPath = resolve(sourceDir, file);

  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath);
    console.log(`✅ Synced ${file} → packages/main-site/`);
  }
});

console.log('🎯 Source sync complete! Always edit packages/main-site/ going forward.');