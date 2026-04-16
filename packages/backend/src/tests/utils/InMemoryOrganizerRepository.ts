import { Organizer } from '@/domain/entities/Organizer'
import { OrganizerRepositoryInterface } from '@/domain/interfaces/OrganizerRepositoryInterface'

export class InMemoryOrganizerRepository implements OrganizerRepositoryInterface {
  private organizers: Organizer[] = []

  async save(organizer: Organizer): Promise<Organizer> {
    this.organizers.push(organizer)
    return organizer
  }

  findAll(): Organizer[] {
    return this.organizers
  }
}
