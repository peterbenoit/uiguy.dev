/**
 * update-sitemap.js
 * Automatically updates the lastmod date in sitemap.xml during build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const publicSitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
	const today = new Date();
	return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Update sitemap with current date
function updateSitemap() {
	try {
		console.log('📁 Reading sitemap from:', sitemapPath);

		// Read the sitemap file
		let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
		console.log('📄 Original lastmod date:', sitemapContent.match(/<lastmod>(.+?)<\/lastmod>/)?.[1] || 'not found');

		// Replace lastmod date with current date
		const currentDate = getCurrentDate();
		console.log('📅 Setting new date:', currentDate);

		const updatedContent = sitemapContent.replace(
			/<lastmod>(.+?)<\/lastmod>/g,
			`<lastmod>${currentDate}</lastmod>`
		);

		// Write updated content back to sitemap.xml
		fs.writeFileSync(sitemapPath, updatedContent, 'utf8');

		// Also copy the updated sitemap to the public directory so it gets included in the build
		fs.writeFileSync(publicSitemapPath, updatedContent, 'utf8');
		console.log(`📋 Copied updated sitemap to public directory`);

		console.log(`✅ Successfully updated sitemap.xml lastmod date to ${currentDate}`);
	} catch (error) {
		console.error('❌ Error updating sitemap.xml:', error);
		console.error('Error details:', error.message);
		console.error('Stack trace:', error.stack);
		process.exit(1);
	}
}

// Run the function
updateSitemap();
