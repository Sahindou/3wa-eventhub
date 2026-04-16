import { A2f_backup_codes as PrismaA2fBackupCodes } from '@prisma/client'
import { OtpBackupCode } from '../../domain/entities/otp-backup-code'

export class OtpBackupCodeMapper {
  static toDomain(prismaData: PrismaA2fBackupCodes): OtpBackupCode {
    return new OtpBackupCode({
      id: prismaData.id,
      user_id: prismaData.user_id,
      recovery_code: prismaData.recovery_code,
      nb_code_used: prismaData.nb_code_used,
      nb_consecutive_tests: prismaData.nb_consecutive_tests,
    })
  }

  static toPrisma(entity: OtpBackupCode) {
    return {
      id: entity.props.id,
      user_id: entity.props.user_id,
      recovery_code: entity.props.recovery_code,
      nb_code_used: entity.props.nb_code_used,
      nb_consecutive_tests: entity.props.nb_consecutive_tests,
    }
  }
}
