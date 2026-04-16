import { User } from '@/domain/entities/'
import { Organizer } from '@/domain/entities/'
import { UserRepositoryInterface } from '@/domain/interfaces/UserRepositoryInterface'
import { OrganizerRepositoryInterface } from '@/domain/interfaces/OrganizerRepositoryInterface'
import { IIdGenerator } from '@/domain/interfaces/IIdGenerator'
import { IPasswordHasher } from '@/domain/interfaces/IPasswordHasher'

export interface RegisterOrganizerDTO {
  // Données User
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  profile_image?: string | null
  // Données Organizer
  company_name: string
  siret: string
  description: string
}

export interface RegisterOrganizerResult {
  userId: string
  organizerId: string
}

export class RegisterOrganizerUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly organizerRepository: OrganizerRepositoryInterface,
    private readonly idGenerator: IIdGenerator,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterOrganizerDTO): Promise<RegisterOrganizerResult> {
    // 1. Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new Error('Email already in use')
    }

    // 2. Hasher le mot de passe
    const hashedPassword = await this.passwordHasher.hash(dto.password)

    // 3. Créer le User
    const userId = this.idGenerator.generate()

    const user = new User({
      id: userId,
      email: dto.email,
      password: hashedPassword,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      role: 'organizer',
      profile_image: dto.profile_image ?? null,
      is_verified: false,
      otp_secret: '',
      otp_enable: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.userRepository.save(user)

    // 4. Créer l'Organizer lié au User
    const organizerId = this.idGenerator.generate()

    const organizer = new Organizer({
      id: organizerId,
      user_id: userId,
      company_name: dto.company_name,
      siret: dto.siret,
      description: dto.description,
      is_verified: false,
      rating: 0.0,
      createdAt: new Date(),
    })

    await this.organizerRepository.save(organizer)

    return { userId, organizerId }
  }
}
