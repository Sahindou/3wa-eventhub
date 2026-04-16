import { OtpBackupCode } from '@/domain/entities/otp-backup-code'
import { IOtpBackupCodeRepository } from '@/domain/interfaces/otp-backup-code-repository.interface'
import { prisma } from '../prisma/client'
import { OtpBackupCodeMapper } from '../mappers'

export class OtpBackupCodeRepositoryDatabase implements IOtpBackupCodeRepository {
  async save(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
    const data = OtpBackupCodeMapper.toPrisma(codeBackup)
    const created = await prisma.a2f_backup_codes.create({ data })
    return OtpBackupCodeMapper.toDomain(created)
  }

  async findByUserId(userId: string): Promise<OtpBackupCode | null> {
    const record = await prisma.a2f_backup_codes.findUnique({
      where: { user_id: userId },
    })

    if (!record) return null
    return OtpBackupCodeMapper.toDomain(record)
  }

  async update(codeBackup: OtpBackupCode): Promise<OtpBackupCode> {
    const data = OtpBackupCodeMapper.toPrisma(codeBackup)
    const updated = await prisma.a2f_backup_codes.update({
      where: { user_id: data.user_id },
      data,
    })
    return OtpBackupCodeMapper.toDomain(updated)
  }
}
