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
 * /api/admin/enquiries:
 *   get:
 *     summary: Get all enquiries with pagination
 *     tags: [Admin - Enquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, contacted, resolved, archived]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of enquiries with pagination
 */
// GET /api/admin/enquiries
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '50' } = req.query
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [enquiries, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.contact.count({ where })
    ])

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/admin/enquiries/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const enquiry = await prisma.contact.findUnique({
      where: { id: req.params.id }
    })

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    res.json({ success: true, data: enquiry })
  } catch (error) {
    console.error('Error fetching enquiry:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// PUT /api/admin/enquiries/:id/status
router.put('/:id/status', [
  body('status').isIn(['new', 'contacted', 'resolved', 'archived']).withMessage('Invalid status')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { status, notes } = req.body

    const enquiry = await prisma.contact.update({
      where: { id: req.params.id },
      data: {
        status,
        notes: notes || undefined
      }
    })

    res.json({ success: true, data: enquiry })
  } catch (error) {
    console.error('Error updating enquiry status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// DELETE /api/admin/enquiries/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.contact.delete({
      where: { id: req.params.id }
    })

    res.json({ success: true, message: 'Enquiry deleted successfully' })
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

// GET /api/admin/enquiries/stats
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const [total, newCount, contactedCount, resolvedCount, archivedCount] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.contact.count({ where: { status: 'contacted' } }),
      prisma.contact.count({ where: { status: 'resolved' } }),
      prisma.contact.count({ where: { status: 'archived' } })
    ])

    res.json({
      success: true,
      data: {
        total,
        new: newCount,
        contacted: contactedCount,
        resolved: resolvedCount,
        archived: archivedCount
      }
    })
  } catch (error) {
    console.error('Error fetching enquiry stats:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

export default router

