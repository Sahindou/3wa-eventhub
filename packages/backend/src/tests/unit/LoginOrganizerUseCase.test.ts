import {
  LoginOrganizerUseCase,
  LoginOrganizerDTO,
} from '@/application/usecases/LoginOrganizerUseCase'
import { InMemoryUserRepository } from '../utils/InMemoryUserRepository'
import { FakePasswordHasher } from '../utils/FakePasswordHasher'
import { FakeTokenGenerator } from '../utils/FakeTokenGenerator'
import { User } from '@/domain/entities/User'

describe('LoginOrganizerUseCase', () => {
  let useCase: LoginOrganizerUseCase
  let userRepository: InMemoryUserRepository
  let passwordHasher: FakePasswordHasher
  let tokenGenerator: FakeTokenGenerator

  const existingUserProps = {
    id: 'user-1',
    email: 'alice@example.com',
    password: 'hashed_SecurePass123',
    first_name: 'Alice',
    last_name: 'Dupont',
    phone: '0600000000',
    role: 'organizer',
    profile_image: null,
    is_verified: true,
    otp_secret: '',
    otp_enable: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    passwordHasher = new FakePasswordHasher()
    tokenGenerator = new FakeTokenGenerator()
    useCase = new LoginOrganizerUseCase(userRepository, passwordHasher, tokenGenerator)

    await userRepository.save(new User(existingUserProps))
  })

  describe('Scenario: Valid credentials', () => {
    it('should return a token and user info', async () => {
      const dto: LoginOrganizerDTO = { email: 'alice@example.com', password: 'SecurePass123' }
      const result = await useCase.execute(dto)

      expect(result.token).toBeDefined()
      expect(result.user.email).toBe('alice@example.com')
      expect(result.user.role).toBe('organizer')
    })

    it('should include user id, first_name and last_name in the result', async () => {
      const result = await useCase.execute({
        email: 'alice@example.com',
        password: 'SecurePass123',
      })
      expect(result.user.id).toBe('user-1')
      expect(result.user.first_name).toBe('Alice')
      expect(result.user.last_name).toBe('Dupont')
    })
  })

  describe('Scenario: Email not found', () => {
    it('should throw an error', async () => {
      const dto: LoginOrganizerDTO = { email: 'unknown@example.com', password: 'SecurePass123' }
      await expect(useCase.execute(dto)).rejects.toThrow('Invalid email or password')
    })
  })

  describe('Scenario: Wrong password', () => {
    it('should throw an error', async () => {
      const dto: LoginOrganizerDTO = { email: 'alice@example.com', password: 'WrongPassword' }
      await expect(useCase.execute(dto)).rejects.toThrow('Invalid email or password')
    })
  })

  describe('Scenario: User is not an organizer', () => {
    it('should throw an error', async () => {
      await userRepository.save(
        new User({
          ...existingUserProps,
          id: 'user-2',
          email: 'bob@example.com',
          role: 'user',
        }),
      )
      const dto: LoginOrganizerDTO = { email: 'bob@example.com', password: 'SecurePass123' }
      await expect(useCase.execute(dto)).rejects.toThrow('Access denied: not an organizer')
    })
  })
})
