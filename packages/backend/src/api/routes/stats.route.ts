import { Router } from 'express'
import { StatsController } from '../controllers/stats.controller'
import { authMiddleware } from '@/api/middlewares/authentication.middleware'

const router = Router()
const statsController = new StatsController()

// GET /api/stats - Dashboard de statistiques (protégé)
router.get('/', authMiddleware, statsController.getDashboardStats.bind(statsController))

export { router as StatsRouter }
