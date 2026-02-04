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
 * /api/admin/services:
 *   get:
 *     summary: Get all services (admin)
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services
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
// GET /api/admin/services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })
    res.json({ success: true, data: services })
  } catch (error) {
    console.error('Error fetching services:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/admin/services/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
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

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - description
 *               - features
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               tag:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               order:
 *                 type: integer
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Validation error
 */
// POST /api/admin/services
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('features').isArray().withMessage('Features must be an array')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, slug, description, icon, features, tag, featured, order, active } = req.body

    // Check if slug already exists
    const existing = await prisma.service.findUnique({
      where: { slug }
    })

    if (existing) {
      return res.status(400).json({ success: false, message: 'Service with this slug already exists' })
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        icon: icon || null,
        features: features || [],
        tag: tag || null,
        featured: featured || false,
        order: order || 0,
        active: active !== undefined ? active : true
      }
    })

    res.status(201).json({ success: true, data: service })
  } catch (error) {
    console.error('Error creating service:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// PUT /api/admin/services/:id
router.put('/:id', [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, slug, description, icon, features, tag, featured, order, active } = req.body

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { id: req.params.id }
    })

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }

    // Check if slug is being changed and if new slug exists
    if (slug !== existing.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug }
      })
      if (slugExists) {
        return res.status(400).json({ success: false, message: 'Service with this slug already exists' })
      }
    }

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        title,
        slug,
        description,
        icon: icon || null,
        features: features || [],
        tag: tag || null,
        featured: featured !== undefined ? featured : existing.featured,
        order: order !== undefined ? order : existing.order,
        active: active !== undefined ? active : existing.active
      }
    })

    res.json({ success: true, data: service })
  } catch (error) {
    console.error('Error updating service:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// DELETE /api/admin/services/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id }
    })

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' })
    }

    await prisma.service.delete({
      where: { id: req.params.id }
    })

    res.json({ success: true, message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router

