import * as bcrypt from 'bcrypt'
import { IOtpBackupCodeRepository } from '@/domain/interfaces/otp-backup-code-repository.interface'

const MAX_CONSECUTIVE_ATTEMPTS = 5

export interface UseBackupCodeDTO {
  userId: string
  code: string
}

export class UseBackupCodeUseCase {
  constructor(private readonly backupCodeRepository: IOtpBackupCodeRepository) {}

  async execute(dto: UseBackupCodeDTO): Promise<void> {
    const record = await this.backupCodeRepository.findByUserId(dto.userId)

    if (!record) {
      throw new Error('Aucun code de récupération trouvé pour cet utilisateur')
    }

    if (record.props.nb_consecutive_tests >= MAX_CONSECUTIVE_ATTEMPTS) {
      throw new Error('Trop de tentatives échouées. Contactez le support.')
    }

    if (record.props.recovery_code.length === 0) {
      throw new Error('Tous les codes de récupération ont déjà été utilisés')
    }

    // Cherche le code soumis parmi les hashs stockés
    let matchedIndex = -1
    for (let i = 0; i < record.props.recovery_code.length; i++) {
      const isMatch = await bcrypt.compare(dto.code, record.props.recovery_code[i])
      if (isMatch) {
        matchedIndex = i
        break
      }
    }

    if (matchedIndex === -1) {
      // Code invalide — incrémente le compteur de tentatives
      record.props.nb_consecutive_tests += 1
      await this.backupCodeRepository.update(record)
      throw new Error('Code de récupération invalide')
    }

    // Code valide — retire le code utilisé et remet le compteur à zéro
    record.props.recovery_code.splice(matchedIndex, 1)
    record.props.nb_code_used += 1
    record.props.nb_consecutive_tests = 0
    await this.backupCodeRepository.update(record)
  }
}
