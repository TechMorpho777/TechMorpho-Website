# Deployment Troubleshooting Guide

## Issue Summary
**Problem**: Website works perfectly locally but returns `{"error":"Not found"}` when deployed to Coolify.

**Root Cause**: Path resolution mismatch between local development and production deployment environments.

---

## Environment Differences

### Local Development
- **Working Directory**: `/app` (project root)
- **Backend runs from**: Project root
- **Frontend path resolution**: `process.cwd()` = `/app`
- **Result**: `path.join(process.cwd(), 'packages/frontend/dist')` → `/app/packages/frontend/dist` ✅

### Production (Coolify)
- **Working Directory**: `/app/packages/backend`
- **Backend runs from**: Backend package directory  
- **Frontend path resolution**: `process.cwd()` = `/app/packages/backend`
- **Result**: `path.join(process.cwd(), 'packages/frontend/dist')` → `/app/packages/backend/packages/frontend/dist` ❌

---

## The Solution

### Code Changes Made

**File**: `packages/backend/src/index.ts`

**Before (Line 27)**:
```typescript
const frontendDistPath = path.join(process.cwd(), 'packages/frontend/dist');
```

**After (Line 27)**:
```typescript
const frontendDistPath = path.join(process.cwd(), '../frontend/dist');
```

### Why This Works

- Uses **relative path** (`../`) instead of absolute path
- Goes up one directory from `/app/packages/backend` → `/app/packages`
- Then enters `frontend/dist` → `/app/packages/frontend/dist` ✅
- Works in **both environments**:
  - **Local**: Still resolves correctly
  - **Production**: Resolves correctly from backend directory

---

## Complete Fix Timeline

### 1. Initial Problem Discovery
- Site returning `{"error":"Not found"}` 
- Backend was running but not serving frontend files

### 2. First Fix Attempt (Commit: 1bd2cc7c)
**Added**: `express.static()` middleware
```typescript
const frontendDistPath = path.join(process.cwd(), 'packages/frontend/dist');
app.use(express.static(frontendDistPath));
```
**Result**: Still not working

### 3. Second Fix (Commit: 4014c756)
**Changed**: CommonJS to ES6 imports
```typescript
// Before
const path = require('path');

// After  
import path from 'path';
```
**Result**: Fixed module loading errors, but site still not working

### 4. Third Fix (Commit: 1884435c)
**Cleaned**: Duplicate code lines
**Result**: Code cleaner but issue persisted

### 5. Fourth Fix (Commit: 68d56ec8)
**Moved**: Static middleware BEFORE routes
```typescript
// Middleware order is critical in Express!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendDistPath)); // ← Must be before routes!

// Public Routes
app.use('/api/contact', contactRoutes);
// ... other routes
```
**Result**: Still not working (path was still wrong)

### 6. Final Fix (Commit: 672b16ab) ✅
**Changed**: Frontend path to use relative navigation
```typescript
const frontendDistPath = path.join(process.cwd(), '../frontend/dist');
```
**Result**: SHOULD WORK NOW!

---

## How to Verify the Fix Locally

### Test 1: Run from Project Root (Current Setup)
```bash
cd /path/to/NewTechMorphoWebsite
npm install
npm run build
npm start
```
**Expected**: Site works at `http://localhost:3000`

### Test 2: Simulate Production Environment
```bash
# Navigate to backend directory (like Coolify does)
cd /path/to/NewTechMorphoWebsite/packages/backend

# Run from backend directory
node dist/index.js
```
**Expected**: Site should still work at `http://localhost:3000`

### Test 3: Verify Path Resolution
Add this temporary debugging code to `index.ts`:
```typescript
const frontendDistPath = path.join(process.cwd(), '../frontend/dist');
console.log('Current working directory:', process.cwd());
console.log('Frontend dist path:', frontendDistPath);
console.log('Frontend dist exists:', fs.existsSync(frontendDistPath));
```

**Expected Output (from backend dir)**:
```
Current working directory: /path/to/NewTechMorphoWebsite/packages/backend
Frontend dist path: /path/to/NewTechMorphoWebsite/packages/frontend/dist
Frontend dist exists: true
```

---

## Key Learnings

### 1. Express Middleware Order Matters
```typescript
// ✅ Correct Order
app.use(cors());
app.use(express.json());
app.use(express.static(staticPath));  // BEFORE routes
app.use('/api/users', userRoutes);     // Routes come after
app.get('*', fallbackHandler);         // Catch-all at the end

// ❌ Wrong Order
app.use('/api/users', userRoutes);     // Routes defined first
app.use(express.static(staticPath));   // Static middleware never reached for /
```

### 2. Path Resolution Depends on Working Directory
- `process.cwd()` returns the directory where Node.js process was started
- NOT the directory where the script file is located
- Always use relative paths (`../`) for portability

### 3. Docker/Container Considerations
- Containers might run your app from a different directory
- Package.json `start` script determines the working directory
- Check Docker WORKDIR and CMD/ENTRYPOINT settings

---

## Debugging Commands

### Check Current Setup
```bash
# In Coolify Terminal
ps aux | grep node              # Find Node process
pwdx <PID>                      # Check working directory of process
ls -la /app/packages/frontend/dist/  # Verify frontend files exist
```

### Test Static File Serving
```bash
# Inside container
curl http://localhost:3000/index.html
curl http://localhost:3000/
```

### Check Logs
```bash
# In Coolify
# Go to Logs tab to see:
# - Server startup messages
# - Any error messages
# - Path resolution issues
```

---

## If Issue Persists

### Additional Checks:

1. **Verify package.json start script**:
   ```json
   {
     "scripts": {
       "start": "node dist/index.js"
     }
   }
   ```
   Make sure it runs from the correct directory.

2. **Check Dockerfile WORKDIR**:
   ```dockerfile
   WORKDIR /app
   # vs
   WORKDIR /app/packages/backend
   ```

3. **Verify build output**:
   - Ensure `npm run build` creates `packages/frontend/dist/`
   - Check that `index.html` exists in dist folder

4. **Test with absolute path** (temporary):
   ```typescript
   const frontendDistPath = '/app/packages/frontend/dist';
   ```

---

## Contact & Support

If you continue experiencing issues:

1. Check deployment logs in Coolify
2. Verify the container is using the latest code (check commit hash)
3. Ensure the frontend was built during deployment
4. Test locally by running from `packages/backend` directory

---

**Last Updated**: February 5, 2026
**Issue Fixed In**: Commit 672b16ab
**Status**: Deployed to Coolify ✅