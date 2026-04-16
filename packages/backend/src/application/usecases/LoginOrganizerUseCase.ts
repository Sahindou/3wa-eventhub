import { UserRepositoryInterface } from '@/domain/interfaces/UserRepositoryInterface'
import { IPasswordHasher } from '@/domain/interfaces/IPasswordHasher'
import { ITokenGenerator } from '@/domain/interfaces/ITokenGenerator'

export interface LoginOrganizerDTO {
  email: string
  password: string
}

export interface LoginOrganizerResult {
  token: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
  }
}

export class LoginOrganizerUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(dto: LoginOrganizerDTO): Promise<LoginOrganizerResult> {
    // 1. Trouver l'utilisateur par email
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // 2. Vérifier le mot de passe
    const props = user.getProps()
    const isPasswordValid = await this.passwordHasher.compare(dto.password, props.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // 3. Vérifier que c'est bien un organizer
    if (props.role !== 'organizer') {
      throw new Error('Access denied: not an organizer')
    }

    // 4. Générer le token JWT
    const token = this.tokenGenerator.generate({
      userId: props.id,
      email: props.email,
      role: props.role,
    })

    return {
      token,
      user: {
        id: props.id,
        email: props.email,
        first_name: props.first_name,
        last_name: props.last_name,
        role: props.role,
      },
    }
  }
}
