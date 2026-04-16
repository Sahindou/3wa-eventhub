import { Organizer as PrismaOrganizer } from '@prisma/client'
import { Organizer } from '../../domain/entities/'

export class OrganizerMapper {
  /**
   * Convertit un objet Prisma en entité Domain
   */
  static toDomain(prismaOrganizer: PrismaOrganizer): Organizer {
    return new Organizer({
      id: prismaOrganizer.id,
      user_id: prismaOrganizer.user_id,
      company_name: prismaOrganizer.company_name,
      siret: prismaOrganizer.siret,
      description: prismaOrganizer.description,
      is_verified: prismaOrganizer.is_verified,
      rating: prismaOrganizer.rating,
      createdAt: prismaOrganizer.createdAt,
    })
  }

  /**
   * Convertit une entité Domain en données Prisma
   */
  static toPrisma(organizer: Organizer) {
    const props = organizer.getProps()
    return {
      id: props.id,
      user_id: props.user_id,
      company_name: props.company_name,
      siret: props.siret,
      description: props.description,
      is_verified: props.is_verified,
      rating: props.rating,
      createdAt: props.createdAt,
    }
  }
}
