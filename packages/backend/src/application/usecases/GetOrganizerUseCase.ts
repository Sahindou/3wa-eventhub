import { UserRepositoryInterface } from '@/domain/interfaces'

export interface GetOrganizerByIdDTO {
  id: string
}

export interface GetOrganizerResult {
  id: string
  email: string
  fristName: string
  last_name: string
  companyName?: string
  siret?: string
  description?: string
  phone: string
  role: string
  profileImage?: string
  isVerified: boolean
  otp_enable: number
}

export class GetOrganizerUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async executeById(dto: GetOrganizerByIdDTO): Promise<GetOrganizerResult> {
    // 1. trouver l'user par l'id
    const user = await this.userRepository.findById(dto.id)

    if (!user) throw new Error('Utilisateur non trouvé')

    return {
      id: user.getProps().id,
      email: user.getProps().email,
      fristName: user.getProps().first_name,
      last_name: user.getProps().last_name,
      phone: user.getProps().phone,
      role: user.getProps().role,
      profileImage: user.getProps().profile_image ?? undefined,
      isVerified: user.getProps().is_verified,
      otp_enable: user.getProps().otp_enable,
    }
  }
}
