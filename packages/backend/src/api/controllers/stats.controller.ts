import { NextFunction, Request, Response } from 'express'
import { prisma } from '@/infrastructure/prisma/client'

export class StatsController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date()

      // count total des events
      const totalEvents = await prisma.event.count()

      // count total organisateur
      const totalOrganizers = await prisma.organizer.count()

      // event à venir
      const upcomingEvents = await prisma.event.count({
        where: { startDate: { gt: now } },
      })

      // event passé
      const pastEvents = await prisma.event.count({
        where: { startDate: { lte: now } },
      })

      // event par mois (6 dernier mois)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const recentEvents = await prisma.event.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      })

      // Grouper par mois côté JS
      const eventsByMonth: Record<string, number> = {}
      recentEvents.forEach((event) => {
        const key = event.createdAt.toISOString().slice(0, 7) // "2025-03"
        eventsByMonth[key] = (eventsByMonth[key] || 0) + 1
      })

      // 6. Top 5 des catégories
      const eventsByCategory = await prisma.event.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      })

      // 7. Prochains événements (liste)
      const nextEvents = await prisma.event.findMany({
        where: { startDate: { gt: now } },
        orderBy: { startDate: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          startDate: true,
          capacity: true,
          price: true,
          categoryId: true,
        },
      })

      res.jsonSuccess({
        totalEvents,
        totalOrganizers,
        upcomingEvents,
        pastEvents,
        eventsByMonth,
        eventsByCategory: eventsByCategory.map((c) => ({
          category: c.categoryId,
          count: c._count.id,
        })),
        nextEvents,
      })
    } catch (error) {
      next(error)
    }
  }
}
