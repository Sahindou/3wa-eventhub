import { Event } from '@/domain/entities/Event'
import { EventRepositoryInterface } from '@/domain/interfaces/EventRepositoryInterface'
import { IIdGenerator } from '@/domain/interfaces/IIdGenerator'

export interface CreateEventDTO {
  title: string
  description: string
  startDate: Date
  endDate: Date
  venueId: string // class venue pour enregistrer les info du lieux
  capacity: number
  price: number
  organizerId: string // class organizer pour enregistrer un organisateur
  categoryId: string // pareil qu'ici
  imageUrl: string
}

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepositoryInterface,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreateEventDTO) {
    // Générer un ID temporaire (on améliorera ça plus tard)
    const id = this.idGenerator.generate()

    const event = new Event({
      id,
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
      venueId: dto.venueId,
      capacity: dto.capacity,
      price: dto.price,
      organizerId: dto.organizerId,
      categoryId: dto.categoryId,
      imageUrl: dto.imageUrl,
    })

    await this.eventRepository.save(event)

    return id
  }
}
