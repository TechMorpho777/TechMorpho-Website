# Coolify Deployment Guide - TechMorpho Website

This guide provides step-by-step instructions to deploy the TechMorpho website on Coolify.

## Prerequisites

- Coolify instance installed and running
- Access to your Coolify dashboard
- Git repository access (GitHub, Azure, or GitLab)
- Domain name (optional, but recommended)

## Overview

This project consists of:
- **Frontend**: React application (served via Nginx)
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL

We'll deploy these as separate services in Coolify.

---

## Step 1: Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, Azure DevOps, or GitLab).

**Current remotes:**
- GitHub: `https://github.com/TechMorpho777/TechMorpho-Website.git`
- Azure: `https://TechMorpho@dev.azure.com/TechMorpho/TechMorpho%20Website/_git/NewTechMorphoWebsite`

---

## Step 2: Set Up PostgreSQL Database in Coolify

### 2.1 Create Database Service

1. **Login to Coolify Dashboard**
2. **Navigate to**: `Resources` → `Databases`
3. **Click**: `+ New Database`
4. **Select**: `PostgreSQL`
5. **Configure**:
   - **Name**: `techmorpho-db` (or your preferred name)
   - **Version**: `15` (or latest stable)
   - **Database Name**: `techmorpho`
   - **Database User**: `techmorpho`
   - **Database Password**: Generate a strong password (save it!)
   - **Public Port**: Leave default or set custom port
6. **Click**: `Deploy`

### 2.2 Get Database Connection String

After deployment, Coolify will provide connection details. Note:
- **Host**: Usually `techmorpho-db` (service name) or internal IP
- **Port**: `5432` (default PostgreSQL port)
- **Database**: `techmorpho`
- **User**: `techmorpho`
- **Password**: The password you set

**Connection String Format:**
```
postgresql://techmorpho:YOUR_PASSWORD@techmorpho-db:5432/techmorpho?schema=public
```

**Important**: In Coolify, services can communicate using service names. Use the database service name as the host.

---

## Step 3: Deploy Backend Service

### 3.1 Create Backend Application

1. **Navigate to**: `Applications` → `+ New Application`
2. **Select**: `Docker Compose` or `Dockerfile`
3. **Choose Repository**:
   - **Git Provider**: Select your provider (GitHub/Azure/GitLab)
   - **Repository**: `TechMorpho-Website` (or your repo name)
   - **Branch**: `main`
   - **Docker Compose File**: Leave empty (we'll use Dockerfile)
   - **Dockerfile Location**: `packages/backend/Dockerfile`
   - **Docker Build Context**: `packages/backend`

### 3.2 Configure Backend Environment Variables

In the application settings, add these environment variables:

```bash
# Database Connection
DATABASE_URL=postgresql://techmorpho:YOUR_PASSWORD@techmorpho-db:5432/techmorpho?schema=public

# Server Configuration
PORT=3000
NODE_ENV=production
BASE_URL=https://yourdomain.com

# Authentication (IMPORTANT: Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

# Optional: Add any other environment variables from packages/backend/env.example
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with the actual database password
- Replace `techmorpho-db` with your actual database service name
- Replace `https://yourdomain.com` with your actual domain
- Generate a strong `JWT_SECRET` (use a password generator or: `openssl rand -base64 32`)

### 3.3 Configure Backend Ports

- **Port**: `3000`
- **Public Port**: Leave default or set custom (e.g., `3000`)

### 3.4 Deploy Backend

1. **Click**: `Deploy`
2. **Wait** for the build to complete
3. **Check logs** to ensure the service started successfully

### 3.5 Run Database Migrations

After the backend is deployed, you need to run Prisma migrations:

1. **Open**: Backend service → `Terminal` or `Execute Command`
2. **Run**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Wait** for migrations to complete

### 3.6 Create Admin User

1. **Open**: Backend service → `Terminal` or `Execute Command`
2. **Run**:
   ```bash
   npm run setup-admin
   ```
3. **Follow prompts** to create your admin account:
   - Email
   - Password
   - Name

---

## Step 4: Deploy Frontend Service

### 4.1 Create Frontend Application

1. **Navigate to**: `Applications` → `+ New Application`
2. **Select**: `Dockerfile`
3. **Choose Repository**:
   - **Git Provider**: Same as backend
   - **Repository**: `TechMorpho-Website`
   - **Branch**: `main`
   - **Dockerfile Location**: `packages/frontend/Dockerfile`
   - **Docker Build Context**: `packages/frontend`

### 4.2 Configure Frontend Environment Variables

The frontend doesn't need many environment variables, but you can add:

```bash
# API Endpoint (if different from default)
VITE_API_URL=https://api.yourdomain.com
```

**Note**: If your backend is on the same domain with `/api` prefix, you may not need this.

### 4.3 Configure Frontend Ports

- **Port**: `80` (Nginx default)
- **Public Port**: Leave default

### 4.4 Deploy Frontend

1. **Click**: `Deploy`
2. **Wait** for the build to complete
3. **Check logs** to ensure Nginx started successfully

---

## Step 5: Configure Domain and SSL

### 5.1 Set Up Domain for Frontend

1. **Open**: Frontend service → `Settings` → `Domains`
2. **Add Domain**: Your domain (e.g., `techmorpho.in`)
3. **Coolify will automatically**:
   - Configure SSL certificate (Let's Encrypt)
   - Set up reverse proxy
   - Configure HTTPS

### 5.2 Set Up Domain for Backend (Optional)

If you want a separate API subdomain:

1. **Open**: Backend service → `Settings` → `Domains`
2. **Add Domain**: `api.yourdomain.com`
3. **SSL will be configured automatically**

**Alternative**: You can proxy API requests through the frontend domain using Nginx configuration.

---

## Step 6: Configure Nginx for API Proxy (Optional)

If you want to serve both frontend and API from the same domain, you need to customize the Nginx configuration.

### 6.1 Create Nginx Configuration File

Create a file `packages/frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    # Frontend static files
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # API proxy
    location /api {
        proxy_pass http://techmorpho-backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Sitemap
    location /sitemap.xml {
        proxy_pass http://techmorpho-backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Update Frontend Dockerfile

Update `packages/frontend/Dockerfile` to use the custom Nginx config:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Important**: Replace `techmorpho-backend` with your actual backend service name in Coolify.

---

## Step 7: Update Environment Variables

After setting up domains, update the `BASE_URL` in backend:

1. **Open**: Backend service → `Environment Variables`
2. **Update**: `BASE_URL` to your actual domain (e.g., `https://techmorpho.in`)
3. **Redeploy** if needed

---

## Step 8: Verify Deployment

### 8.1 Check Services Status

- **Frontend**: Should be accessible at your domain
- **Backend**: Should respond at `/api/health`
- **Database**: Should be running

### 8.2 Test Endpoints

1. **Frontend**: Visit `https://yourdomain.com`
2. **API Health**: `https://yourdomain.com/api/health`
3. **Admin Login**: `https://yourdomain.com/admin/login`

### 8.3 Test Admin Dashboard

1. **Login** with the admin credentials you created
2. **Verify** you can access:
   - Dashboard
   - Services management
   - Enquiries
   - Settings

---

## Step 9: Post-Deployment Setup

### 9.1 Configure Settings in Admin Dashboard

1. **Login** to admin dashboard
2. **Navigate to**: Settings
3. **Configure**:
   - **SEO Settings**: Meta tags, descriptions
   - **Google Tag Manager**: Add your GTM ID
   - **Google Analytics**: Add your GA ID
   - **Social Media**: Add your social media links
   - **Sitemap**: Generate sitemap

### 9.2 Add Services

1. **Navigate to**: Services
2. **Add** your services with:
   - Title
   - Description
   - Icon (emoji, SVG, or image)
   - Features
   - Status (Active/Inactive)

---

## Troubleshooting

### Backend Won't Start

1. **Check logs**: Backend service → `Logs`
2. **Common issues**:
   - Database connection failed → Check `DATABASE_URL`
   - Port already in use → Change port in settings
   - Missing environment variables → Check all required vars

### Frontend Can't Connect to Backend

1. **Check API URL**: Ensure frontend can reach backend
2. **If using same domain**: Ensure Nginx proxy is configured
3. **If using different domains**: Update CORS settings in backend
4. **Check service names**: In Coolify, services communicate via service names

### Database Connection Issues

1. **Verify database is running**: Check database service status
2. **Check connection string**: Ensure service name is correct
3. **Test connection**: Use backend terminal to test:
   ```bash
   npx prisma db pull
   ```

### Build Failures

1. **Check build logs**: Application → `Build Logs`
2. **Common issues**:
   - Node version mismatch → Ensure Dockerfile uses Node 18+
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Fix type errors

### SSL Certificate Issues

1. **Wait**: Let's Encrypt certificates can take a few minutes
2. **Check DNS**: Ensure domain points to Coolify server
3. **Verify**: Check SSL status in domain settings

---

## Maintenance

### Updating the Application

1. **Push changes** to your Git repository
2. **Coolify will detect** changes (if auto-deploy is enabled)
3. **Or manually**: Click `Redeploy` in the service

### Database Backups

1. **Navigate to**: Database service → `Backups`
2. **Configure**: Automatic backups
3. **Schedule**: Daily or weekly backups

### Monitoring

- **Check logs** regularly for errors
- **Monitor** resource usage (CPU, Memory)
- **Set up** alerts in Coolify if available

---

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `BASE_URL` | Your domain | `https://techmorpho.in` |
| `JWT_SECRET` | JWT signing secret | Random string (32+ chars) |

### Frontend Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.techmorpho.in` |

---

## Quick Reference Commands

### Access Backend Terminal

```bash
# Run migrations
npx prisma migrate deploy

# Create admin user
npm run setup-admin

# Generate Prisma client
npx prisma generate

# Check database connection
npx prisma db pull
```

### Check Service Logs

- **Frontend**: Application → `Logs`
- **Backend**: Application → `Logs`
- **Database**: Database → `Logs`

---

## Support

If you encounter issues:

1. **Check logs** in Coolify dashboard
2. **Verify** all environment variables are set
3. **Test** database connection
4. **Review** this guide for common issues
5. **Check** Coolify documentation: https://coolify.io/docs

---

## Additional Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Docker Documentation**: https://docs.docker.com

---

**Deployment Complete!** 🎉

Your TechMorpho website should now be live on Coolify!

