import { randomBytes } from 'crypto'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { OtpBackupCode } from '@/domain/entities/otp-backup-code'
import { IOtpBackupCodeRepository } from '@/domain/interfaces/otp-backup-code-repository.interface'
import { UserRepositoryInterface } from '@/domain/interfaces'

const CODES_COUNT = 8
const BCRYPT_ROUNDS = 10

export class GenerateBackupCodesUseCase {
  constructor(
    private readonly backupCodeRepository: IOtpBackupCodeRepository,
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<string[]> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    if (!user.getProps().otp_enable) {
      throw new Error("L'A2F doit être activée avant de générer des codes de récupération")
    }

    // Génère N codes lisibles au format xxxx-xxxx-xxxx-xxxx
    const plainCodes = Array.from({ length: CODES_COUNT }, () => {
      const parts = Array.from({ length: 4 }, () => randomBytes(2).toString('hex'))
      return parts.join('-')
    })

    // Hash chaque code avant stockage
    const hashedCodes = await Promise.all(
      plainCodes.map((code) => bcrypt.hash(code, BCRYPT_ROUNDS)),
    )

    const existing = await this.backupCodeRepository.findByUserId(userId)

    if (existing) {
      existing.props.recovery_code = hashedCodes
      existing.props.nb_code_used = 0
      existing.props.nb_consecutive_tests = 0
      await this.backupCodeRepository.update(existing)
    } else {
      const entity = new OtpBackupCode({
        id: uuidv4(),
        user_id: userId,
        recovery_code: hashedCodes,
        nb_code_used: 0,
        nb_consecutive_tests: 0,
      })
      await this.backupCodeRepository.save(entity)
    }

    // Retourne les codes en clair — à afficher une seule fois
    return plainCodes
  }
}
