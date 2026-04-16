import { User } from '@/domain/entities/'
import { UserRepositoryInterface } from '@/domain/interfaces/UserRepositoryInterface'
import { IIdGenerator } from '@/domain/interfaces/IIdGenerator'

export interface CreateUserDTO {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  role: string
  profile_image?: string | null
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(dto: CreateUserDTO): Promise<string> {
    const id = this.idGenerator.generate()

    const user = new User({
      id,
      email: dto.email,
      password: dto.password,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      role: dto.role,
      profile_image: dto.profile_image ?? null,
      is_verified: false,
      otp_secret: '',
      otp_enable: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.userRepository.save(user)

    return id
  }
}
