export interface OtpBackupCodeProps {
  id: string
  user_id: string
  recovery_code: string[]
  nb_code_used: number
  nb_consecutive_tests: number
}

export class OtpBackupCode {
  constructor(public props: OtpBackupCodeProps) {}

  validateOrThrow() {
    if (!this.props.recovery_code) {
      throw new Error('codes is required')
    }

    if (typeof this.props.nb_code_used !== 'number' || this.props.nb_code_used < 0) {
      throw new Error('nb_code_used is required')
    }

    if (
      typeof this.props.nb_consecutive_tests !== 'number' ||
      this.props.nb_consecutive_tests < 0
    ) {
      throw new Error('nb_consecutive_tests is required')
    }
  }
}
