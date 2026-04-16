import { IPasswordHasher } from '@/domain/interfaces/IPasswordHasher'

export class FakePasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed_${password}`
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === `hashed_${password}`
  }
}
