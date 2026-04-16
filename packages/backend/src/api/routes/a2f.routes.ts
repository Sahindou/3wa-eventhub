import { Router } from 'express'
import { authMiddleware } from '@/api/middlewares/authentication.middleware'
import {
  qrCode,
  verifyOtp,
  generateBackupCodes,
  useBackupCode,
} from '../controllers/a2f.controller'

const router = Router()

router.get('/qrcode', authMiddleware, qrCode)
router.post('/verify', authMiddleware, verifyOtp)
router.post('/backup-codes/generate', authMiddleware, generateBackupCodes)
router.post('/backup-codes/use', authMiddleware, useBackupCode)

export { router as a2fRouter }
