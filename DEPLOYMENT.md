# Deployment Guide

This guide covers deploying the TechMorpho website to production.

## Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose (recommended)
- PostgreSQL database (or use Docker)
- Domain name (optional, for production)

## Environment Setup

### 1. Backend Environment Variables

Create a `.env` file in `packages/backend/` based on `env.example`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/techmorpho?schema=public"

# Server
PORT=3000
NODE_ENV=production
BASE_URL="https://yourdomain.com"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Important:** 
- Change `JWT_SECRET` to a strong, random string in production
- Update `BASE_URL` to your actual domain
- Use a secure database connection string

### 2. Database Setup

#### Option A: Using Docker Compose

```bash
docker-compose up -d postgres
```

#### Option B: External PostgreSQL

Ensure your PostgreSQL database is accessible and create the database:

```sql
CREATE DATABASE techmorpho;
```

### 3. Run Database Migrations

```bash
cd packages/backend
npx prisma generate
npx prisma migrate deploy
```

### 4. Create Admin User

```bash
cd packages/backend
npm run setup-admin
```

Follow the prompts to create your admin account.

## Build for Production

### Build All Packages

```bash
npm run build
```

This will:
- Build the frontend React app (output: `packages/frontend/dist/`)
- Compile the backend TypeScript (output: `packages/backend/dist/`)

### Start Production Server

```bash
npm start
```

This starts the backend server. The frontend should be served statically or through a reverse proxy.

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up -d --build
```

This will:
- Build frontend and backend containers
- Start PostgreSQL database
- Run all services

### Access Services

- Frontend: http://localhost:5173 (or your configured port)
- Backend API: http://localhost:3000
- Database: localhost:5432

### Stop Services

```bash
docker-compose down
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Admin user created
- [ ] JWT_SECRET changed from default
- [ ] BASE_URL updated to production domain
- [ ] CORS configured for production domain
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured
- [ ] Error logging/monitoring set up
- [ ] Frontend built and deployed
- [ ] Backend API accessible

## Reverse Proxy Setup (Nginx Example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/packages/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT_SECRET** - Generate a random string for production
3. **Enable HTTPS** - Use SSL certificates for production
4. **Configure CORS** - Restrict to your production domain
5. **Database Security** - Use strong passwords and restrict access
6. **Regular Updates** - Keep dependencies updated
7. **Backup Database** - Set up automated backups

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check database is running and accessible
- Ensure firewall allows connections

### Build Errors

- Clear node_modules and reinstall: `npm run clean && npm install`
- Check Node.js version: `node --version` (should be >= 18)

### Admin Login Issues

- Verify admin user was created: `npm run setup:admin`
- Check JWT_SECRET is set correctly
- Verify database has user records

## Support

For issues or questions, refer to the main README.md or SETUP_ADMIN.md files.

