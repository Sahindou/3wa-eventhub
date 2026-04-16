import { Organizer } from '@/domain/entities/'
import { OrganizerRepositoryInterface } from '@/domain/interfaces/OrganizerRepositoryInterface'
import { IIdGenerator } from '@/domain/interfaces/IIdGenerator'

export interface CreateOrganizerDTO {
  user_id: string
  company_name: string
  siret: string
  description: string
}

export class CreateOrganizerUseCase {
  constructor(
    private readonly organizerRepository: OrganizerRepositoryInterface,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreateOrganizerDTO): Promise<string> {
    const id = this.idGenerator.generate()

    const organizer = new Organizer({
      id,
      user_id: dto.user_id,
      company_name: dto.company_name,
      siret: dto.siret,
      description: dto.description,
      is_verified: false,
      rating: 0.0,
      createdAt: new Date(),
    })

    await this.organizerRepository.save(organizer)

    return id
  }
}
