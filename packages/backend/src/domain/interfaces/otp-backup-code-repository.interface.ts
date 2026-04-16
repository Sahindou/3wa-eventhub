import { OtpBackupCode } from '../entities/otp-backup-code'

export interface IOtpBackupCodeRepository {
  save(codeBackup: OtpBackupCode): Promise<OtpBackupCode>
  findByUserId(id: string): Promise<OtpBackupCode | null>
  update(codeBackup: OtpBackupCode): Promise<OtpBackupCode>
}
