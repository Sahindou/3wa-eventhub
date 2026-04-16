import { OtpBackupCode } from '../../domain/entities/otp-backup-code'
import { IOtpBackupCodeRepository } from '../../domain/interfaces/otp-backup-code-repository.interface'

export class MemoryOtpBackupCodeRepository implements IOtpBackupCodeRepository {
  private codesBackup: OtpBackupCode[] = []

  async save(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
    this.codesBackup.push(codeBackup)

    return codeBackup
  }

  async findByUserId(id: string): Promise<OtpBackupCode | null> {
    return this.codesBackup.find((codesBackup) => codesBackup.props.user_id === id) ?? null
  }

  async update(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
    const index = this.codesBackup.findIndex((c) => c.props.user_id === codeBackup.props.user_id)
    if (index === -1) {
      throw new Error('Backup code non trouvé')
    }
    this.codesBackup[index] = codeBackup
    return codeBackup
  }
}
