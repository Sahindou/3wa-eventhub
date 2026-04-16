import { Organizer } from '@/domain/entities'
import { OrganizerRepositoryInterface } from '@/domain/interfaces/'
import { prisma } from '../prisma/client'
import { OrganizerMapper } from '../mappers'

export class OrganizerRepositoryDatabase implements OrganizerRepositoryInterface {
  async save(organizer: Organizer): Promise<Organizer> {
    try {
      const prismaData = OrganizerMapper.toPrisma(organizer)
      const createdUser = await prisma.organizer.create({ data: prismaData })

      return OrganizerMapper.toDomain(createdUser)
    } catch (e: any) {
      throw new Error(`Failed to save user: ${e.message}`)
    }
  }
}
