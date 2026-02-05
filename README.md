# TechMorpho IT Solutions - Monorepo

A modern, full-stack web application built with React (TypeScript), Node.js, Express, PostgreSQL, and Prisma ORM.

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend**: React.js with TypeScript, Vite
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker containerized

## 📁 Project Structure

```
.
├── packages/
│   ├── frontend/          # React TypeScript frontend
│   ├── backend/           # Express TypeScript backend
│   └── shared/            # Shared types and utilities
├── docker-compose.yml     # Docker orchestration
├── Dockerfile             # Docker configuration
└── package.json          # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL (or Docker for containerized setup)
- npm >= 9.0.0

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Run migrations and create admin:**
   ```bash
   cd packages/backend
   npx prisma generate
   npx prisma migrate dev --name init
   npm run setup-admin
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Admin: http://localhost:5173/admin/login

### Admin Login

After running the setup, you'll need to create an admin user. See [SETUP_ADMIN.md](./SETUP_ADMIN.md) for instructions.

### Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick production build:**
```bash
npm run build
npm start
```

## 🐳 Docker Deployment

### Build and run with Docker Compose:

```bash
docker-compose up -d
```

This will:
- Build frontend and backend containers
- Start PostgreSQL database
- Run all services

### Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: localhost:5432

## 📦 Packages

### Frontend (`packages/frontend`)
- React 18 with TypeScript
- Vite for fast development
- Modern UI with enhanced design
- Responsive and optimized

### Backend (`packages/backend`)
- Express.js with TypeScript
- Prisma ORM
- RESTful API
- Contact form handling

### Shared (`packages/shared`)
- Shared TypeScript types
- Common utilities

## 🛠️ Scripts

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages for production
- `npm run start` - Start production server
- `npm run lint` - Lint all packages

## 📝 Environment Variables

See `packages/backend/env.example` for required environment variables.

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🎨 Features

- ✅ Modern, responsive design
- ✅ Fast performance with code splitting
- ✅ Type-safe with TypeScript
- ✅ Docker containerized
- ✅ PostgreSQL database
- ✅ Contact form with backend integration
- ✅ SEO optimized
- ✅ Mobile-first design
- ✅ **Admin Dashboard** - Manage services, enquiries, and settings
- ✅ **Sitemap Generation** - Automatic XML sitemap generation
- ✅ **Google Tag Manager** - Easy GTM and Analytics integration
- ✅ **Enquiry Management** - Track and manage all contact form submissions

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin/login`

**Features:**
- Service management (CRUD operations)
- Enquiry management with status tracking
- Settings management (SEO, Analytics, Sitemap)
- Google Tag Manager integration
- Sitemap generation

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed admin documentation.

## 📄 License

© 2025 TechMorpho IT Solutions. All rights reserved.
