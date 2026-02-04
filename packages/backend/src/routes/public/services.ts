import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of active services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        active: true
      },
      orderBy: {
        order: 'asc'
      }
    })
    res.json({ success: true, data: services })
  } catch (error) {
    console.error('Error fetching services:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

/**
 * @swagger
 * /api/services/{slug}:
 *   get:
 *     summary: Get a service by slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Service slug
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findFirst({
      where: {
        slug: req.params.slug,
        active: true
      }
    })

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }

    res.json({ success: true, data: service })
  } catch (error) {
    console.error('Error fetching service:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router

