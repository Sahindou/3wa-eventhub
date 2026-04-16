import { User as PrismaUser } from '@prisma/client'
import { User } from '../../domain/entities/'

export class UserMapper {
  /**
   * Convertit un objet Prisma en entité Domain
   */
  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      first_name: prismaUser.first_name,
      last_name: prismaUser.last_name,
      phone: prismaUser.phone,
      role: prismaUser.role,
      profile_image: prismaUser.profile_image,
      is_verified: prismaUser.is_verified,
      otp_secret: prismaUser.otp_secret,
      otp_enable: prismaUser.otp_enable,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    })
  }

  /**
   * Convertit une entité Domain en données Prisma
   */
  static toPrisma(user: User) {
    const props = user.getProps()
    return {
      id: props.id,
      email: props.email,
      password: props.password,
      first_name: props.first_name,
      last_name: props.last_name,
      phone: props.phone,
      role: props.role,
      profile_image: props.profile_image,
      is_verified: props.is_verified,
      otp_secret: props.otp_secret,
      otp_enable: props.otp_enable,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
  }
}
