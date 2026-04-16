// src/api/controllers/EventController.ts

import { Request, Response, NextFunction } from 'express'
import { CreateEventUseCase } from '@/application/usecases/CreateEventUseCase'
import { EventRepositoryDatabase } from '@/infrastructure/repositories'

export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly eventRepository: EventRepositoryDatabase,
  ) {}

  // POST /api/events
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Extraire les données du body
      const dto = {
        title: req.body.title,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        venueId: req.body.venueId,
        capacity: Number(req.body.capacity),
        price: Number(req.body.price),
        organizerId: req.body.organizerId,
        categoryId: req.body.categoryId,
        imageUrl: req.body.imageUrl,
      }

      // 2. Exécuter le Use Case
      const eventId = await this.createEventUseCase.execute(dto)

      // 3. Retourner la réponse
      res.jsonSuccess({ id: eventId }, 201)
    } catch (error) {
      // 4. Déléguer la gestion d'erreur au middleware
      next(error)
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))

      const { events, total } = await this.eventRepository.findAllPaginated(page, limit)

      const totalPages = Math.ceil(total / limit)

      res.jsonSuccess({
        data: events,
        total,
        page,
        totalPages,
      })
    } catch (error) {
      next(error)
    }
  }
}
