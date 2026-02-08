import express from 'express'
import cors from 'cors'
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

const app = express()
const PORT = process.env.PORT || 3000
const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
}).on('error', (err: any) => {
  console.error('❌ Server failed to start:', err.message)
  if (err.code === 'EADDRINUSE') {
    console.error(`   Port ${PORT} is already in use. Please stop the other process or change the PORT.`)
  }
  process.exit(1)
})

export default app

