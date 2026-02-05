import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// GET /sitemap.xml
router.get('/', async (req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'sitemap_xml' }
    })

    if (setting) {
      res.set('Content-Type', 'application/xml')
      res.send(setting.value)
    } else {
      res.status(404).send('Sitemap not found. Please generate it from admin dashboard.')
    }
  } catch (error) {
    console.error('Error serving sitemap:', error)
    res.status(500).send('Error generating sitemap')
  }
})

export default router

