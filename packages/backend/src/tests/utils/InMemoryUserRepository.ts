import { User } from '@/domain/entities/User'
import { UserRepositoryInterface } from '@/domain/interfaces/UserRepositoryInterface'

export class InMemoryUserRepository implements UserRepositoryInterface {
  private users: User[] = []

  async save(user: User): Promise<User> {
    this.users.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.getProps().email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.getProps().id === id) ?? null
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.getProps().id === user.getProps().id)
    if (index === -1) throw new Error(`User not found`)
    this.users[index] = user
    return user
  }
}
