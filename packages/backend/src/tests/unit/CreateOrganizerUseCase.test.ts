import {
  CreateOrganizerUseCase,
  CreateOrganizerDTO,
} from '@/application/usecases/CreateOrganizerUseCase'
import { InMemoryOrganizerRepository } from '../utils/InMemoryOrganizerRepository'
import { StaticIdGenerator } from '../utils/StaticIdGenerator'

describe('CreateOrganizerUseCase', () => {
  let useCase: CreateOrganizerUseCase
  let repository: InMemoryOrganizerRepository
  let idGenerator: StaticIdGenerator

  const validDTO: CreateOrganizerDTO = {
    user_id: 'user-1',
    company_name: 'EventPro SARL',
    siret: '12345678901234',
    description: "Organisateur d'événements professionnels",
  }

  beforeEach(() => {
    repository = new InMemoryOrganizerRepository()
    idGenerator = new StaticIdGenerator()
    useCase = new CreateOrganizerUseCase(repository, idGenerator)
  })

  describe('Scenario: Valid payload', () => {
    it('should return the generated id', async () => {
      const id = await useCase.execute(validDTO)
      expect(id).toBe('test-event-123')
    })

    it('should save the organizer in the repository', async () => {
      await useCase.execute(validDTO)
      const organizers = repository.findAll()
      expect(organizers).toHaveLength(1)
      expect(organizers[0].getProps().company_name).toBe(validDTO.company_name)
      expect(organizers[0].getProps().siret).toBe(validDTO.siret)
    })

    it('should set is_verified to false by default', async () => {
      await useCase.execute(validDTO)
      const organizer = repository.findAll()[0]
      expect(organizer.getProps().is_verified).toBe(false)
    })
  })

  describe('Scenario: Missing user_id', () => {
    it('should throw an error', async () => {
      await expect(useCase.execute({ ...validDTO, user_id: '' })).rejects.toThrow(
        'user_id is required',
      )
    })
  })

  describe('Scenario: Missing company_name', () => {
    it('should throw an error', async () => {
      await expect(useCase.execute({ ...validDTO, company_name: '' })).rejects.toThrow(
        'company_name is required',
      )
    })
  })

  describe('Scenario: Missing siret', () => {
    it('should throw an error', async () => {
      await expect(useCase.execute({ ...validDTO, siret: '' })).rejects.toThrow('siret is required')
    })
  })
})
