#!/usr/bin/env node
/**
 * Simplified Build Script - Single Source of Truth
 * Copies files from src/ to root for GitHub Pages deployment
 */

import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';

console.log('🚀 Building site from simplified structure...\n');

// Clean old files first (except critical ones)
const filesToKeep = [
    'package.json', 'package-lock.json', '.gitignore', 'README.md',
    '.github', 'node_modules', 'src', 'scripts', 'SIMPLIFIED-STRUCTURE.md', 'CNAME'
];

console.log('🧹 Cleaning old redundant files...');
try {
    const rootFiles = readdirSync('.');
    rootFiles.forEach(file => {
        if (!filesToKeep.includes(file) && !file.startsWith('.')) {
            console.log(`🗑️  Removing ${file}`);
            try {
                rmSync(file, { recursive: true, force: true });
            } catch (err) {
                console.warn(`⚠️  Could not remove ${file}: ${err.message}`);
            }
        }
    });
} catch (error) {
    console.warn('⚠️  Error during cleanup:', error.message);
}

console.log('\n📁 Copying files from src/ to root...');

// Copy HTML files
console.log('📄 Copying HTML files...');
const htmlFiles = readdirSync('src/pages').filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
    copyFileSync(`src/pages/${file}`, file);
    console.log(`✅ ${file}`);
});

// Copy CSS files
console.log('\n🎨 Copying CSS files...');
const cssFiles = readdirSync('src/styles').filter(f => f.endsWith('.css'));
cssFiles.forEach(file => {
    copyFileSync(`src/styles/${file}`, file);
    console.log(`✅ ${file}`);
});

// Copy JS files
console.log('\n⚡ Copying JS files...');
const jsFiles = readdirSync('src/scripts').filter(f => f.endsWith('.js'));
jsFiles.forEach(file => {
    copyFileSync(`src/scripts/${file}`, file);
    console.log(`✅ ${file}`);
});

// Copy media directory
console.log('\n🖼️  Copying media files...');
if (existsSync('src/media')) {
    if (existsSync('media')) {
        rmSync('media', { recursive: true, force: true });
    }

    const { execSync } = await import('child_process');
    execSync('cp -r src/media media');
    console.log('✅ Media directory copied');
} else {
    console.warn('⚠️  No src/media directory found');
}

// Copy components directory
console.log('\n⚙️  Copying component files...');
if (existsSync('src/components')) {
    if (existsSync('components')) {
        rmSync('components', { recursive: true, force: true });
    }

    const { execSync } = await import('child_process');
    execSync('cp -r src/components components');
    console.log('✅ Components directory copied');
} else {
    console.warn('⚠️  No src/components directory found');
}

// Copy markdown directory
console.log('\n📚 Copying markdown files...');
if (existsSync('src/markdown')) {
    if (existsSync('markdown')) {
        rmSync('markdown', { recursive: true, force: true });
    }

    const { execSync } = await import('child_process');
    execSync('cp -r src/markdown markdown');
    console.log('✅ Markdown directory copied');
} else {
    console.warn('⚠️  No src/markdown directory found');
}

// Validation checks
console.log('\n🔍 Running validations...');

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

console.log('\n🎉 Build completed successfully!');
console.log('📝 Edit files in src/ directory going forward');
console.log('🚀 Root files ready for GitHub Pages deployment');