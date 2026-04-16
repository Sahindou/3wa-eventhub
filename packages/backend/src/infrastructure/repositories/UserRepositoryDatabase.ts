import { User } from '@/domain/entities'
import { UserRepositoryInterface } from '@/domain/interfaces/UserRepositoryInterface'
import { prisma } from '../prisma/client'
import { UserMapper } from '../mappers'

export class UserRepositoryDatabase implements UserRepositoryInterface {
  async save(user: User): Promise<User> {
    try {
      const prismaData = UserMapper.toPrisma(user)
      const createdUser = await prisma.user.create({ data: prismaData })

      return UserMapper.toDomain(createdUser)
    } catch (e: any) {
      throw new Error(`Failed to save user: ${e.message}`)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { id } })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async update(user: User): Promise<User> {
    const props = UserMapper.toPrisma(user)
    const updated = await prisma.user.update({
      where: { id: props.id },
      data: props,
    })
    return UserMapper.toDomain(updated)
  }
}
