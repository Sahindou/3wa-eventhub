import { Request, Response, NextFunction } from 'express'
import { AnalyticsEventModel } from '../../infrastructure/mongodb/analytics.model'

// POST /api/analytics — enregistre un event
export const trackEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventName, userId, page } = req.body
    await AnalyticsEventModel.create({ eventName, userId, page })
    res.status(201).json({ message: 'Event tracked' })
  } catch (error) {
    next(error)
  }
}

// GET /api/analytics — agrège les pages les plus vues
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topPages = await AnalyticsEventModel.aggregate([
      { $match: { eventName: 'page_view' } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { page: '$_id', count: 1, _id: 0 } },
    ])

    res.json({ data: { topPages } })
  } catch (error) {
    next(error)
  }
}
