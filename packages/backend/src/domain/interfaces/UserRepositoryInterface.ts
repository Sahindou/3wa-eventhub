import { User } from '../entities/'

export interface UserRepositoryInterface {
  save(user: User): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  update(user: User): Promise<User>
}
