import { verify, NobleCryptoPlugin } from 'otplib'
import { UserRepositoryInterface } from '@/domain/interfaces'

export interface VerifyOtpDTO {
  userId: string
  token: string
  secret?: string
}

export type VerifyOtpMode = 'activation' | 'login'

export class VerifyOtpUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(dto: VerifyOtpDTO): Promise<VerifyOtpMode> {
    const user = await this.userRepository.findById(dto.userId)

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    // Activation : secret fourni dans le body
    if (dto.secret) {
      const result = await verify({
        secret: dto.secret,
        token: dto.token,
        epochTolerance: 30,
        crypto: new NobleCryptoPlugin(),
      })

      if (!result.valid) {
        throw new Error('Code OTP invalide')
      }

      user.enableOtp(dto.secret)
      await this.userRepository.update(user)
      return 'activation'
    }

    // Vérification au login : secret récupéré depuis la DB
    const storedSecret = user.getProps().otp_secret

    if (!storedSecret) {
      throw new Error('A2F non configurée pour cet utilisateur')
    }

    const result = await verify({
      secret: storedSecret,
      token: dto.token,
      epochTolerance: 30,
      crypto: new NobleCryptoPlugin(),
    })

    if (!result.valid) {
      throw new Error('Code OTP invalide')
    }

    return 'login'
  }
}
