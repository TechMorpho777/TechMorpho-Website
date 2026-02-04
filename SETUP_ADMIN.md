# Admin Dashboard Setup

## 🚀 Admin Setup

### Manual Setup

#### Step 1: Run Database Migrations

```bash
cd packages/backend
npx prisma migrate dev --name add_admin_features
npx prisma generate
```

#### Step 2: Create Admin User

**Using Interactive Script:**
```bash
cd packages/backend
npm run setup-admin
```

This will prompt you to enter:
- Email
- Password
- Name

**Or Create Custom Admin:**
```bash
cd packages/backend
npm run create-admin
```

**Or Using API:**
```bash
curl -X POST http://localhost:3000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techmorpho.in",
    "password": "your-secure-password",
    "name": "Admin Name"
  }'
```

### Step 3: Set Environment Variables

Add to `packages/backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BASE_URL=https://techmorpho.in
```

### Step 4: Access Admin Dashboard

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:5173/admin/login`
3. Login with your admin credentials

## 📋 What You Can Do

### Manage Services
- Add, edit, delete services
- Set featured status
- Manage service order
- Add features and descriptions

### Manage Enquiries
- View all contact form submissions
- Update enquiry status
- Add internal notes
- Filter by status

### Configure Settings
- Add Google Tag Manager ID
- Add Google Analytics ID
- Generate sitemap
- Update site information

## 🔒 Security Notes

- Change the default JWT_SECRET in production
- Use strong passwords (minimum 8 characters)
- Don't commit `.env` files to version control
- Regularly update admin passwords

## 🆘 Troubleshooting

**Can't create admin?**
- Ensure database is running
- Check Prisma migrations are applied
- Verify DATABASE_URL in .env

**Can't login?**
- Verify admin account exists
- Check password is correct
- Ensure JWT_SECRET is set

**Dashboard not loading?**
- Check backend is running on port 3000
- Verify CORS settings
- Check browser console for errors

