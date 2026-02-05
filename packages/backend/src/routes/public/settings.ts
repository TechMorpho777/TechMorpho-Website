import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * @swagger
 * tags:
 *   name: Public Settings
 *   description: Public API for fetching settings
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get public settings by category
 *     tags: [Public Settings]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Settings category (e.g., social)
 *     responses:
 *       200:
 *         description: Settings object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
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
    console.error('Error fetching public settings:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /api/settings/page-seo:
 *   get:
 *     summary: Get page SEO settings by path
 *     tags: [Public Settings]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Page path (e.g., /, /services, /services/web-development)
 *     responses:
 *       200:
 *         description: Page SEO settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     metaTitle:
 *                       type: string
 *                     metaDescription:
 *                       type: string
 *                     metaKeywords:
 *                       type: string
 *                     ogTitle:
 *                       type: string
 *                     ogDescription:
 *                       type: string
 *                     ogImage:
 *                       type: string
 *                     canonicalUrl:
 *                       type: string
 */
router.get('/page-seo', async (req: Request, res: Response) => {
  try {
    const path = req.query.path as string
    if (!path) {
      return res.status(400).json({ success: false, message: 'Path parameter is required' })
    }
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
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router

