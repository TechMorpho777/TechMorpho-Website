import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('service').notEmpty().withMessage('Service selection is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
]

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get contact submissions (admin only)
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: List of contact submissions
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
 *                     $ref: '#/components/schemas/ContactResponse'
 */
// POST /api/contact
router.post('/', contactValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, phone, service, message } = req.body

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        service,
        message
      }
    })

    // In production, you would send an email here
    // For now, we'll just return success

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email
      }
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    })
  }
})

// GET /api/contact (for admin - optional)
router.get('/', async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    res.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router

