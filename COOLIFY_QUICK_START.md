# Coolify Quick Start Checklist

Use this checklist for a quick deployment reference.

## Pre-Deployment

- [ ] Code pushed to Git repository (GitHub/Azure/GitLab)
- [ ] Coolify instance is running and accessible
- [ ] Domain name ready (optional but recommended)

## Step 1: Database Setup

- [ ] Create PostgreSQL database in Coolify
  - Name: `techmorpho-db`
  - Database: `techmorpho`
  - User: `techmorpho`
  - Password: (save this!)
- [ ] Note database connection details
- [ ] Database is running and healthy

## Step 2: Backend Deployment

- [ ] Create new application in Coolify
- [ ] Connect to Git repository
- [ ] Set Dockerfile path: `packages/backend/Dockerfile`
- [ ] Set build context: `packages/backend`
- [ ] Configure environment variables:
  - [ ] `DATABASE_URL` (from Step 1)
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=production`
  - [ ] `BASE_URL` (your domain)
  - [ ] `JWT_SECRET` (generate strong random string)
- [ ] Deploy backend service
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Create admin user: `npm run setup-admin`
- [ ] Verify backend health: `/api/health` endpoint

## Step 3: Frontend Deployment

- [ ] Create new application in Coolify
- [ ] Connect to same Git repository
- [ ] Set Dockerfile path: `packages/frontend/Dockerfile`
- [ ] Set build context: `packages/frontend`
- [ ] Configure environment variables (optional):
  - [ ] `VITE_API_URL` (if using separate API domain)
- [ ] Deploy frontend service
- [ ] Verify frontend is accessible

## Step 4: Domain & SSL

- [ ] Add domain to frontend service
- [ ] SSL certificate automatically configured
- [ ] (Optional) Add API subdomain to backend
- [ ] Update `BASE_URL` in backend if needed
- [ ] Test HTTPS access

## Step 5: Configuration

- [ ] Update Nginx config with correct backend service name (if using API proxy)
- [ ] Test frontend loads correctly
- [ ] Test API endpoints work
- [ ] Test admin login works

## Step 6: Post-Deployment

- [ ] Login to admin dashboard
- [ ] Configure SEO settings
- [ ] Add Google Tag Manager ID
- [ ] Add Google Analytics ID
- [ ] Add social media links
- [ ] Generate sitemap
- [ ] Add services
- [ ] Test contact form

## Verification Tests

- [ ] Frontend loads at your domain
- [ ] API health check: `/api/health` returns OK
- [ ] Admin login works
- [ ] Services page displays correctly
- [ ] Contact form submits successfully
- [ ] Admin dashboard shows enquiries
- [ ] SSL certificate is valid

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `DATABASE_URL` and logs |
| Frontend can't reach API | Check service names in Nginx config |
| Database connection failed | Verify service name and credentials |
| Build fails | Check Node version and dependencies |
| SSL not working | Verify DNS points to Coolify |

## Important Notes

1. **Service Names**: In Coolify, services communicate using their service names. Update `nginx.conf` with your actual backend service name.

2. **Database URL Format**: 
   ```
   postgresql://user:password@service-name:5432/database?schema=public
   ```

3. **JWT Secret**: Generate a strong random string (32+ characters). Never use the default!

4. **Environment Variables**: All backend env vars are required. Frontend vars are optional.

5. **Migrations**: Must run after first deployment: `npx prisma migrate deploy`

6. **Admin Setup**: Must run after migrations: `npm run setup-admin`

## Quick Commands

```bash
# Backend Terminal Commands
npx prisma migrate deploy    # Run migrations
npm run setup-admin          # Create admin user
npx prisma generate          # Generate Prisma client
npx prisma db pull           # Test database connection
```

## Support

- Full guide: See `COOLIFY_DEPLOYMENT.md`
- Coolify docs: https://coolify.io/docs
- Project docs: See `README.md` and `DEPLOYMENT.md`

---

**Ready to deploy?** Follow the steps above and refer to `COOLIFY_DEPLOYMENT.md` for detailed instructions!

