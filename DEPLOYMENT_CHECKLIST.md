# Deployment Checklist

Use this checklist to ensure your TechMorpho website is ready for production deployment.

## Pre-Deployment

### Environment Setup
- [ ] Copy `packages/backend/env.example` to `packages/backend/.env`
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generate a strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Update `BASE_URL` to your production domain (e.g., `https://techmorpho.in`)
- [ ] Configure `DATABASE_URL` with production database credentials
- [ ] Verify all environment variables are set correctly

### Database
- [ ] PostgreSQL database is created and accessible
- [ ] Database migrations are run: `npx prisma migrate deploy`
- [ ] Prisma client is generated: `npx prisma generate`
- [ ] Admin user is created: `npm run setup-admin`
- [ ] Database backups are configured

### Code Quality
- [ ] All build artifacts removed: `npm run clean:build`
- [ ] No hardcoded credentials in code
- [ ] No development URLs in production code
- [ ] All console.log statements removed (except error logging)
- [ ] TypeScript compilation passes: `npm run type-check`
- [ ] No linting errors: `npm run lint`

### Security
- [ ] `.env` file is in `.gitignore` (never commit)
- [ ] `JWT_SECRET` is strong and unique
- [ ] CORS is configured for production domain only
- [ ] HTTPS/SSL is enabled
- [ ] Database credentials are secure
- [ ] API rate limiting is configured (if needed)

## Build

### Frontend
- [ ] Build frontend: `cd packages/frontend && npm run build`
- [ ] Verify `packages/frontend/dist/` contains build files
- [ ] Test production build locally: `npm run preview`
- [ ] Check for broken links or missing assets

### Backend
- [ ] Build backend: `cd packages/backend && npm run build`
- [ ] Verify `packages/backend/dist/` contains compiled files
- [ ] Test backend API endpoints
- [ ] Verify Swagger documentation is accessible

## Deployment

### Server Setup
- [ ] Node.js >= 18.0.0 is installed
- [ ] PM2 or similar process manager is installed (recommended)
- [ ] Reverse proxy (Nginx/Apache) is configured
- [ ] SSL certificate is installed and valid
- [ ] Firewall rules are configured

### Application Deployment
- [ ] Application files are uploaded to server
- [ ] Environment variables are set on server
- [ ] Dependencies are installed: `npm install --production`
- [ ] Database connection is tested
- [ ] Application starts successfully

### Post-Deployment
- [ ] Frontend is accessible at production URL
- [ ] Backend API is accessible at `/api`
- [ ] Admin login works: `/admin/login`
- [ ] Contact form submits successfully
- [ ] Services page loads correctly
- [ ] Individual service pages work (e.g., `/services/test2`)
- [ ] SEO meta tags are working
- [ ] Google Tag Manager/Analytics is configured
- [ ] Sitemap is accessible at `/sitemap.xml`

## Monitoring

- [ ] Error logging is configured
- [ ] Application monitoring is set up
- [ ] Database monitoring is active
- [ ] Uptime monitoring is configured
- [ ] Backup schedule is verified

## Documentation

- [ ] Deployment documentation is updated
- [ ] Environment variables are documented
- [ ] Admin credentials are securely stored
- [ ] Database connection details are documented

## Rollback Plan

- [ ] Previous version backup is available
- [ ] Database backup is recent
- [ ] Rollback procedure is documented
- [ ] Team knows how to rollback if needed

## Final Checks

- [ ] All tests pass (if applicable)
- [ ] Performance is acceptable
- [ ] Mobile responsiveness is verified
- [ ] Cross-browser compatibility is tested
- [ ] SEO settings are configured
- [ ] Social media links are correct
- [ ] Contact information is accurate

---

**Important Notes:**
- Never commit `.env` files to version control
- Always test in a staging environment first
- Keep backups of database before major changes
- Monitor application logs after deployment
- Document any custom configurations

