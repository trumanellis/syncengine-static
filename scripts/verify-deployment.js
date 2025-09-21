#!/usr/bin/env node
/**
 * Deployment verification script to ensure site is properly deployed
 */

import { execSync } from 'child_process';
import fs from 'fs';

const SITE_URL = 'https://syncengine.earth';
const RETRY_COUNT = 3;
const RETRY_DELAY = 10000; // 10 seconds

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function runCommand(command, description) {
    console.log(`🔄 ${description}...`);
    try {
        const result = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        console.log(`✅ ${description} - Success`);
        return { success: true, output: result };
    } catch (error) {
        console.log(`❌ ${description} - Failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function verifyDeployment() {
    console.log('🚀 Starting deployment verification...\n');

    // 1. Check if GitHub Pages build is complete
    console.log('📋 Step 1: Checking GitHub Pages build status');
    const buildStatus = runCommand(
        'gh api repos/trumanellis/syncengine-static/pages/builds | jq -r ".[0].status"',
        'Check GitHub Pages build status'
    );

    if (!buildStatus.success || buildStatus.output.trim() !== 'built') {
        console.log('⚠️ GitHub Pages build not complete. Status:', buildStatus.output?.trim() || 'unknown');
        return false;
    }

    // 2. Verify local files are correct
    console.log('\n📋 Step 2: Verifying local files');

    const fileChecks = [
        {
            file: 'tractor.html',
            test: (content) => !content.includes('Test Modal') && !content.includes('Test button'),
            description: 'Test modal removed from tractor.html'
        },
        {
            file: 'eden-game.html',
            test: (content) => content.includes('href="/agua-lila.html"') && content.includes('Start with Água Lila'),
            description: 'Eden Game button links correctly'
        },
        {
            file: 'sacred-theme.css',
            test: (content) => content.includes('stewardship-map-card') && content.includes('max-width: 100%'),
            description: 'Image overflow fixes present'
        }
    ];

    for (const check of fileChecks) {
        if (fs.existsSync(check.file)) {
            const content = fs.readFileSync(check.file, 'utf8');
            if (check.test(content)) {
                console.log(`✅ ${check.description}`);
            } else {
                console.log(`❌ ${check.description}`);
                return false;
            }
        } else {
            console.log(`❌ File ${check.file} not found`);
            return false;
        }
    }

    // 3. Test site accessibility with retries
    console.log('\n📋 Step 3: Testing site accessibility');

    for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
        console.log(`🔄 Attempt ${attempt}/${RETRY_COUNT}: Testing ${SITE_URL}`);

        const siteCheck = runCommand(
            `curl -f -s -o /dev/null -w "%{http_code}" "${SITE_URL}"`,
            `Check site accessibility (attempt ${attempt})`
        );

        if (siteCheck.success && siteCheck.output.trim() === '200') {
            console.log('✅ Site is accessible!');
            break;
        } else if (attempt === RETRY_COUNT) {
            console.log(`❌ Site not accessible after ${RETRY_COUNT} attempts`);
            console.log('ℹ️ CDN propagation can take 5-10 minutes for custom domains');
            return false;
        } else {
            console.log(`⏳ Waiting ${RETRY_DELAY/1000}s before next attempt...`);
            await sleep(RETRY_DELAY);
        }
    }

    // 4. Verify specific content on live site
    console.log('\n📋 Step 4: Verifying live site content');

    const contentCheck = runCommand(
        `curl -s "${SITE_URL}/eden-game.html" | grep -q 'Start with Água Lila'`,
        'Check Eden Game page content'
    );

    if (!contentCheck.success) {
        console.log('❌ Eden Game page content verification failed');
        return false;
    }

    console.log('\n🎉 All deployment verifications passed!');
    console.log(`📝 Site is live at: ${SITE_URL}`);
    return true;
}

// Run verification
verifyDeployment().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('💥 Verification script error:', error);
    process.exit(1);
});