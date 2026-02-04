import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    req.userId = decoded.userId
    req.userRole = decoded.role

    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin' && req.userRole !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}

