import { Router } from 'express'
import { EventRouter } from './event.route'
import { OrganizerRouter } from './organizer.route'
import { a2fRouter } from './a2f.routes'
import { StatsRouter } from './stats.route'
import { AnalyticsRouter } from './analytics.route'

const router = Router()

router.use('/api/events', EventRouter)
router.use('/api/organizers', OrganizerRouter)
router.use('/api/stats', StatsRouter)
router.use('/api/analytics', AnalyticsRouter)

// route de la A2F
router.use('/api/a2f', a2fRouter)

export { router as routers }
