import {
  RegisterOrganizerUseCase,
  RegisterOrganizerDTO,
} from '@/application/usecases/RegisterOrganizerUseCase'
import { InMemoryUserRepository } from '../utils/InMemoryUserRepository'
import { InMemoryOrganizerRepository } from '../utils/InMemoryOrganizerRepository'
import { StaticIdGenerator } from '../utils/StaticIdGenerator'
import { FakePasswordHasher } from '../utils/FakePasswordHasher'

describe('RegisterOrganizerUseCase', () => {
  let useCase: RegisterOrganizerUseCase
  let userRepository: InMemoryUserRepository
  let organizerRepository: InMemoryOrganizerRepository
  let idGenerator: StaticIdGenerator
  let passwordHasher: FakePasswordHasher

  const validDTO: RegisterOrganizerDTO = {
    email: 'alice@example.com',
    password: 'SecurePass123',
    first_name: 'Alice',
    last_name: 'Dupont',
    phone: '0600000000',
    company_name: 'EventPro SARL',
    siret: '12345678901234',
    description: "Organisateur d'événements professionnels",
  }

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    organizerRepository = new InMemoryOrganizerRepository()
    idGenerator = new StaticIdGenerator()
    passwordHasher = new FakePasswordHasher()
    useCase = new RegisterOrganizerUseCase(
      userRepository,
      organizerRepository,
      idGenerator,
      passwordHasher,
    )
  })

  describe('Scenario: Valid registration', () => {
    it('should return userId and organizerId', async () => {
      const result = await useCase.execute(validDTO)
      expect(result.userId).toBeDefined()
      expect(result.organizerId).toBeDefined()
    })

    it('should save the user in the repository', async () => {
      await useCase.execute(validDTO)
      const savedUser = await userRepository.findByEmail(validDTO.email)
      expect(savedUser).not.toBeNull()
      expect(savedUser?.getProps().email).toBe(validDTO.email)
    })

    it('should hash the password before saving', async () => {
      await useCase.execute(validDTO)
      const savedUser = await userRepository.findByEmail(validDTO.email)
      expect(savedUser?.getProps().password).toBe(`hashed_${validDTO.password}`)
    })

    it("should assign the role 'organizer' to the user", async () => {
      await useCase.execute(validDTO)
      const savedUser = await userRepository.findByEmail(validDTO.email)
      expect(savedUser?.getProps().role).toBe('organizer')
    })

    it('should save the organizer in the repository', async () => {
      await useCase.execute(validDTO)
      const organizers = organizerRepository.findAll()
      expect(organizers).toHaveLength(1)
      expect(organizers[0].getProps().company_name).toBe(validDTO.company_name)
    })
  })

  describe('Scenario: Email already in use', () => {
    it('should throw an error', async () => {
      await useCase.execute(validDTO)
      await expect(useCase.execute(validDTO)).rejects.toThrow('Email already in use')
    })
  })
})
