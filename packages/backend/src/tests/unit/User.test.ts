import { User } from '@/domain/entities/User'

const validProps = {
  id: 'user-1',
  email: 'alice@example.com',
  password: 'hashedpassword',
  first_name: 'Alice',
  last_name: 'Dupont',
  phone: '0600000000',
  role: 'organizer',
  profile_image: null,
  is_verified: false,
  otp_secret: '',
  otp_enable: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('User entity', () => {
  describe('Validation', () => {
    it('should create a valid user', () => {
      const user = new User(validProps)
      expect(user.getProps().email).toBe('alice@example.com')
    })

    it('should throw when email is empty', () => {
      expect(() => new User({ ...validProps, email: '' })).toThrow('email is required')
    })

    it('should throw when email format is invalid', () => {
      expect(() => new User({ ...validProps, email: 'not-an-email' })).toThrow(
        'email format is invalid',
      )
    })

    it('should throw when password is empty', () => {
      expect(() => new User({ ...validProps, password: '' })).toThrow('password is required')
    })

    it('should throw when first_name is empty', () => {
      expect(() => new User({ ...validProps, first_name: '' })).toThrow('first_name is required')
    })

    it('should throw when last_name is empty', () => {
      expect(() => new User({ ...validProps, last_name: '' })).toThrow('last_name is required')
    })
  })

  describe('Business methods', () => {
    it('should set is_verified to true after verify()', () => {
      const user = new User(validProps)
      user.verify()
      expect(user.getProps().is_verified).toBe(true)
    })

    it('should enable OTP with secret after enableOtp()', () => {
      const user = new User(validProps)
      user.enableOtp('MYSECRET')
      expect(user.getProps().otp_enable).toBe(1)
      expect(user.getProps().otp_secret).toBe('MYSECRET')
    })
  })
})
