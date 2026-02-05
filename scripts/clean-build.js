#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dirsToRemove = [
  'packages/frontend/dist',
  'packages/backend/dist',
  'packages/shared/dist',
  'dist',
  'build'
];

console.log('🧹 Cleaning build artifacts...');

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

console.log('✅ Build cleanup complete!');

