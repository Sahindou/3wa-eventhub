import { Event } from '@/domain/entities/Event'
import { EventRepositoryInterface } from '@/domain/interfaces/EventRepositoryInterface'
import { prisma } from '../prisma/client'
import { EventMapper } from '../mappers/EventMapper'

export class EventRepositoryDatabase implements EventRepositoryInterface {
  async save(event: Event): Promise<Event> {
    try {
      const prismaData = EventMapper.toPrisma(event)
      const createdEvent = await prisma.event.create({ data: prismaData })

      return EventMapper.toDomain(createdEvent)
    } catch (e: any) {
      throw new Error(`Failed to save event: ${e.message}`)
    }
  }

  async findById(id: string): Promise<Event | null> {
    try {
      const prismaEvent = await prisma.event.findUnique({ where: { id } })

      if (!prismaEvent) return null

      return EventMapper.toDomain(prismaEvent)
    } catch (e: any) {
      throw new Error(`Failed to find event: ${e.message}`)
    }
  }

  async findAll(): Promise<Event[]> {
    try {
      const prismaEvent = await prisma.event.findMany()

      return prismaEvent.map(EventMapper.toDomain)
    } catch (error: any) {
      throw new Error(`Failed to fetch events: ${error.message}`)
    }
  }

  async update(event: Event): Promise<Event> {
    try {
      const prismaData = EventMapper.toPrisma(event)

      const updatedEvent = await prisma.event.update({
        where: { id: event.getId() },
        data: prismaData,
      })

      return EventMapper.toDomain(updatedEvent)
    } catch (error: any) {
      throw new Error(`Failed to update event: ${error.message}`)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.event.delete({
        where: { id },
      })
    } catch (error: any) {
      throw new Error(`Failed to delete event: ${error.message}`)
    }
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    try {
      const prismaEvents = await prisma.event.findMany({
        where: { organizerId },
      })

      return prismaEvents.map(EventMapper.toDomain)
    } catch (error: any) {
      throw new Error(`Failed to find events by organizer: ${error.message}`)
    }
  }

  async findByCategoryId(categoryId: string): Promise<Event[]> {
    try {
      const prismaEvents = await prisma.event.findMany({
        where: { categoryId },
      })

      return prismaEvents.map(EventMapper.toDomain)
    } catch (error: any) {
      throw new Error(`Failed to find events by category: ${error.message}`)
    }
  }

  async findByDate(date: Date): Promise<Event[]> {
    try {
      const prismaEvents = await prisma.event.findMany({
        where: {
          startDate: {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          },
        },
      })

      return prismaEvents.map(EventMapper.toDomain)
    } catch (error: any) {
      throw new Error(`Failed to find events by date: ${error.message}`)
    }
  }

  async findAllPaginated(page: number, limit: number): Promise<{ events: Event[]; total: number }> {
    try {
      const skip = (page - 1) * limit // offset-based: page 1 → skip 0, page 2 → skip 10

      const [prismaEvents, total] = await Promise.all([
        prisma.event.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.event.count(),
      ])

      return {
        events: prismaEvents.map(EventMapper.toDomain),
        total,
      }
    } catch (error: any) {
      throw new Error(`Failed to fetch paginated events: ${error.message}`)
    }
  }
}
