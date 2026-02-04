#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dirsToRemove = [
  'packages/frontend/node_modules',
  'packages/backend/node_modules',
  'packages/shared/node_modules',
  'node_modules'
];

console.log('🧹 Cleaning node_modules...');

dirsToRemove.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`   ✓ Removed ${dir}`);
    } catch (error) {
      console.error(`   ✗ Error removing ${dir}:`, error.message);
    }
  }
});

console.log('✅ Modules cleanup complete!');

