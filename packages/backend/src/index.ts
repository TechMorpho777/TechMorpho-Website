import express from 'express'
import cors from 'cors'
import path from 'path';
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.js'
import contactRoutes from './routes/contact.js'
import authRoutes from './routes/auth.js'
import adminServicesRoutes from './routes/admin/services.js'
import adminEnquiriesRoutes from './routes/admin/enquiries.js'
import adminSettingsRoutes from './routes/admin/settings.js'
import publicServicesRoutes from './routes/public/services.js'
import publicSettingsRoutes from './routes/public/settings.js'
import { PrismaClient } from '@prisma/client'

dotenv.config()
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const PORT = process.env.PORT || 3000
const prisma = new PrismaClient()

// Simple test route
app.get('/', (req, res) => {
  res.send('TechMorpho Website - Working!');
});

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const frontendDistPath = path.join(__dirname, '../../frontend/dist')// Serve frontend static files
app.use(express.static(frontendDistPath));


// Public Routes
app.use('/api/contact', contactRoutes)
app.use('/api/services', publicServicesRoutes)
app.use('/api/settings', publicSettingsRoutes)
app.use('/api/admin/auth', authRoutes)

// Admin Routes (protected)
app.use('/api/admin/services', adminServicesRoutes)
app.use('/api/admin/enquiries', adminEnquiriesRoutes)
app.use('/api/admin/settings', adminSettingsRoutes)

// Sitemap route (public)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'sitemap_xml' }
    })

    if (setting && setting.value) {
      res.set('Content-Type', 'application/xml')
      res.send(setting.value)
    } else {
      // Generate a basic sitemap if none exists
      const baseUrl = process.env.BASE_URL || 'https://techmorpho.in'
      const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
      res.set('Content-Type', 'application/xml')
      res.send(basicSitemap)
    }
  } catch (error) {
    console.error('Error serving sitemap:', error)
    res.status(500).send('Error generating sitemap')
  }
})

// Root route
app.get('/', (req, res) => res.json({ status: 'ok', message: 'TechMorpho Backend API running!' }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TechMorpho API Documentation'
}))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TechMorpho API is running' })
})

// Start server

// Fallback route for SPA

app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<h1>TechMorpho Website</h1><p>Frontend files are being loaded...</p>');
  
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app

