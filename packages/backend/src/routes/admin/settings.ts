import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin, AuthRequest } from '../../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Apply auth middleware to all routes
router.use(authenticate)
router.use(requireAdmin)

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Get all settings
 *     tags: [Admin - Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settings object
 */
// GET /api/admin/settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query

    const where: any = {}
    if (category) {
      where.category = category
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { key: 'asc' }
    })

    // Convert to key-value object
    const settingsObj: Record<string, any> = {}
    settings.forEach(setting => {
      let value: any = setting.value
      if (setting.type === 'json') {
        try {
          value = JSON.parse(setting.value)
        } catch (e) {
          value = setting.value
        }
      } else if (setting.type === 'boolean') {
        value = setting.value === 'true'
      } else if (setting.type === 'number') {
        value = parseFloat(setting.value)
      }
      settingsObj[setting.key] = value
    })

    res.json({ success: true, data: settingsObj })
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// POST /api/admin/settings
router.post('/', [
  body('key').notEmpty().withMessage('Key is required'),
  body('value').notEmpty().withMessage('Value is required'),
  body('type').isIn(['text', 'json', 'boolean', 'number']).withMessage('Invalid type'),
  body('category').optional()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { key, value, type, category } = req.body

    let stringValue = value
    if (type === 'json') {
      stringValue = JSON.stringify(value)
    } else if (type === 'boolean') {
      stringValue = value ? 'true' : 'false'
    } else if (type === 'number') {
      stringValue = String(value)
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        category: category || 'general'
      },
      create: {
        key,
        value: stringValue,
        type,
        category: category || 'general'
      }
    })

    res.json({ success: true, data: setting })
  } catch (error) {
    console.error('Error saving setting:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/admin/settings/pages
router.get('/pages', async (req: Request, res: Response) => {
  try {
    // Static pages
    const staticPages = [
      { name: 'Home', path: '/', type: 'static' },
      { name: 'Services', path: '/services', type: 'static' },
      { name: 'About', path: '/about', type: 'static' },
      { name: 'Contact', path: '/contact', type: 'static' },
      { name: 'Portfolio', path: '/portfolio', type: 'static' }
    ]

    // Dynamic service pages
    const services = await prisma.service.findMany({
      where: { active: true },
      select: { title: true, slug: true },
      orderBy: { order: 'asc' }
    })

    const dynamicPages = services.map(service => ({
      name: service.title,
      path: `/services/${service.slug}`,
      type: 'dynamic' as const
    }))

    const allPages = [...staticPages, ...dynamicPages]

    res.json({ success: true, data: allPages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/admin/settings/page-seo?path=... (optional path parameter)
router.get('/page-seo', async (req: Request, res: Response) => {
  try {
    const path = req.query.path as string | undefined
    
    // If path is provided, return specific page SEO
    if (path) {
      const decodedPath = decodeURIComponent(path)
      const key = `page_seo_${decodedPath}`

    const setting = await prisma.setting.findUnique({
      where: { key }
    })

    if (!setting) {
      return res.json({ 
        success: true, 
        data: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          canonicalUrl: ''
        }
      })
    }

    let value: any = setting.value
    if (setting.type === 'json') {
      try {
        value = JSON.parse(setting.value)
      } catch (e) {
        value = {}
      }
    }

      res.json({ success: true, data: value })
    } else {
      // If no path provided, return all page SEO settings
      const pageSeoSettings = await prisma.setting.findMany({
        where: { category: 'page_seo' },
        orderBy: { key: 'asc' }
      })

      const seoData: Record<string, any> = {}
      pageSeoSettings.forEach(setting => {
        if (setting.type === 'json') {
          try {
            seoData[setting.key] = JSON.parse(setting.value)
          } catch (e) {
            seoData[setting.key] = setting.value
          }
        } else {
          seoData[setting.key] = setting.value
        }
      })

      res.json({ success: true, data: seoData })
    }
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/admin/settings/sitemap
router.get('/sitemap/generate', async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.BASE_URL || 'https://techmorpho.in'
    
    const services = await prisma.service.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true }
    })

    const routes = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/services', changefreq: 'weekly', priority: '0.9' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.8' },
      { url: '/portfolio', changefreq: 'weekly', priority: '0.8' }
    ]

    services.forEach(service => {
      routes.push({
        url: `/services/${service.slug}`,
        changefreq: 'weekly',
        priority: '0.7'
      })
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    // Save to database
    await prisma.setting.upsert({
      where: { key: 'sitemap_xml' },
      update: {
        value: sitemap,
        type: 'text',
        category: 'seo'
      },
      create: {
        key: 'sitemap_xml',
        value: sitemap,
        type: 'text',
        category: 'seo'
      }
    })

    res.json({ success: true, data: { sitemap, routes: routes.length } })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router

