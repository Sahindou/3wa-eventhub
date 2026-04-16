import { Event } from '@/domain/entities/Event'
import { EventRepositoryInterface } from '@/domain/interfaces/EventRepositoryInterface'

export class InMemoryEventRepository implements EventRepositoryInterface {
  private events: Event[] = []

  async save(event: Event): Promise<Event> {
    this.events.push(event)
    return event
  }

  async findById(id: string): Promise<Event | null> {
    const event = this.events.find((event) => event.getId() === id)

    return event ?? null
  }
  async findAll(): Promise<Event[]> {
    return this.events
  }

  async update(event: Event): Promise<Event> {
    const index = this.events.findIndex((e) => e.getId() === event.getId())

    if (index === -1) {
      throw new Error(`Event with id ${event.getId()} not found`)
    }

    this.events[index] = event

    return event
  }

  async delete(id: string): Promise<void> {
    const index = this.events.findIndex((e) => e.getId() === id)

    if (index === -1) throw new Error(`Event with id ${id} not found`)

    this.events.splice(index, 1)
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    return this.events.filter((event) => event.getIdOrganizer() === organizerId)
  }

  async findByCategoryId(categoryId: string): Promise<Event[]> {
    return this.events.filter((event) => event.getIdCategory() === categoryId)
  }

  async findByDate(date: Date): Promise<Event[]> {
    return this.events.filter((event) => event.getStartDate().getTime() === date.getTime())
  }

  async findAllPaginated(page: number, limit: number): Promise<{ events: Event[]; total: number }> {
    const skip = (page - 1) * limit
    const events = this.events.slice(skip, skip + limit)
    return { events, total: this.events.length }
  }
}
