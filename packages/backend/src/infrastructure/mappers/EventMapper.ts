import { Event as PrismaEvent } from '@prisma/client'
import { Event } from '../../domain/entities/Event'

export class EventMapper {
  /**
   * Convertit un objet Prisma en entité Domain
   */
  static toDomain(prismaEvent: PrismaEvent): Event {
    return new Event({
      id: prismaEvent.id,
      title: prismaEvent.title,
      description: prismaEvent.description,
      startDate: prismaEvent.startDate,
      endDate: prismaEvent.endDate,
      venueId: prismaEvent.venueId,
      capacity: prismaEvent.capacity,
      price: prismaEvent.price,
      organizerId: prismaEvent.organizerId,
      categoryId: prismaEvent.categoryId,
      imageUrl: prismaEvent.imageUrl,
      createdAt: prismaEvent.createdAt,
      updatedAt: prismaEvent.updatedAt,
    })
  }

  /**
   * Convertit une entité Domain en données Prisma
   */
  static toPrisma(event: Event) {
    return {
      id: event.getId(),
      title: event.getTitle(),
      description: event.getDescription(),
      startDate: event.getStartDate(),
      endDate: event.getEndDate(),
      venueId: event.getIdVenue(),
      capacity: event.getCapacity(),
      price: event.getPrice(),
      organizerId: event.getIdOrganizer(),
      categoryId: event.getIdCategory(),
      imageUrl: event.getImageUrl(),
      createdAt: event.getCreatedAt(),
      updatedAt: event.getUpdatedAt(),
    }
  }
}
