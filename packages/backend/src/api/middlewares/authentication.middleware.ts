import { Request, Response, NextFunction } from 'express'
import { JwtTokenGenerator } from '@/infrastructure/services/JwtTokenGenerator'
import { TokenPayload } from '@/domain/interfaces/ITokenGenerator'

// Étendre le type Request pour inclure l'utilisateur authentifié
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

const tokenGenerator = new JwtTokenGenerator(process.env.JWT_SECRET || 'your-secret-key')

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Récupérer le token du header Authorization
    const token = req.cookies?.token

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied: No token provided',
      })
      return
    }

    // 2. Vérifier le token
    const payload = tokenGenerator.verify(token)

    if (!payload) {
      res.status(401).json({
        success: false,
        message: 'Access denied: Invalid or expired token',
      })
      return
    }

    // 3. Ajouter les infos utilisateur à la requête
    req.user = payload

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Access denied: Authentication failed',
    })
  }
}

// Middleware pour vérifier un rôle spécifique
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied: Not authenticated',
      })
      return
    }

    if (req.user.role !== role) {
      res.status(403).json({
        success: false,
        message: `Access denied: Requires ${role} role`,
      })
      return
    }

    next()
  }
}
