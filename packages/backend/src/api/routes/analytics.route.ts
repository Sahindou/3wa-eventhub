import { Router } from 'express'
import { trackEvent, getAnalytics } from '../controllers/analytics.controller'

const router = Router()

router.post('/', trackEvent)
router.get('/', getAnalytics)

export { router as AnalyticsRouter }
