export interface UserProps {
  id: string
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  role: string
  profile_image: string | null
  is_verified: boolean
  otp_secret: string
  otp_enable: number
  createdAt: Date
  updatedAt: Date
}

export class User {
  private props: UserProps

  constructor(props: UserProps) {
    this.validateOrThrow(props)
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    }
  }

  private validateOrThrow(props: UserProps): void {
    if (!props.email || props.email.trim() === '') {
      throw new Error('email is required')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(props.email)) {
      throw new Error('email format is invalid')
    }
    if (!props.password || props.password.trim() === '') {
      throw new Error('password is required')
    }
    if (!props.first_name || props.first_name.trim() === '') {
      throw new Error('first_name is required')
    }
    if (!props.last_name || props.last_name.trim() === '') {
      throw new Error('last_name is required')
    }
  }

  // Getters
  getProps(): UserProps {
    return this.props
  }

  // Méthodes métier
  verify(): void {
    this.props.is_verified = true
  }

  enableOtp(secret: string): void {
    this.props.otp_secret = secret
    this.props.otp_enable = 1
  }
}
