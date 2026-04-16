import { Organizer } from '../entities/'

export interface OrganizerRepositoryInterface {
  save(event: Organizer): Promise<Organizer>
}
