import { CreateEventUseCase, CreateEventDTO } from '@/application/usecases/CreateEventUseCase'
import { InMemoryEventRepository } from '@/infrastructure/repositories/InMemoryEventRepository'
import { StaticIdGenerator } from '../utils/StaticIdGenerator'

describe('Create Event use case', () => {
  let useCase: CreateEventUseCase
  let repository: InMemoryEventRepository
  let idGenerator: StaticIdGenerator

  // donnée valide par défaut
  const validEventDTO: CreateEventDTO = {
    title: 'Concert de Jazz',
    description: 'Un super concert de jazz au cœur de Paris',
    startDate: new Date(Date.now() + 86400000), // Demain
    endDate: new Date(Date.now() + 90000000), // Demain + 1 heure
    venueId: 'venue-123',
    capacity: 200,
    price: 25.5,
    organizerId: 'org-456',
    categoryId: 'cat-789',
    imageUrl: 'https://example.com/concert.jpg',
  }

  beforeEach(() => {
    repository = new InMemoryEventRepository()
    idGenerator = new StaticIdGenerator()
    useCase = new CreateEventUseCase(repository, idGenerator)
  })

  describe('Scenario: No title', () => {
    it('should throw an error', async () => {
      const invalidDTO = {
        ...validEventDTO,
        title: '',
      }
      await expect(() => useCase.execute(invalidDTO)).rejects.toThrow('title is required')
    })
  })

  describe('Scenario: No description', () => {
    it('should throw an error', async () => {
      const invalidDTO = {
        ...validEventDTO,
        description: '',
      }
      await expect(() => useCase.execute(invalidDTO)).rejects.toThrow('description is required')
    })
  })

  describe('Scenario: Start date in the past', () => {
    it('should throw an error', async () => {
      const invalidDTO = {
        ...validEventDTO,
        startDate: new Date(Date.now() - 86400000), // hier
      }

      await expect(useCase.execute(invalidDTO)).rejects.toThrow(
        'startDate is required and must be in the future',
      )
    })
  })

  describe('Scenario: End date before start date', () => {
    it('should throw an error', async () => {
      const invalidDTO = {
        ...validEventDTO,
        startDate: new Date(Date.now() + 86400000), // Demain
        endDate: new Date(Date.now() + 80000000), //avant la date de début
      }

      await expect(useCase.execute(invalidDTO)).rejects.toThrow(
        'the end date must be after or equal to the current date.',
      )
    })
  })

  describe('Scenario: Invalid capacity', () => {
    it('should throw an error when capacity is 0', async () => {
      const invalidDTO = {
        ...validEventDTO,
        capacity: 0, // ❌ Capacité nulle
      }

      await expect(useCase.execute(invalidDTO)).rejects.toThrow(
        'capacity is required and must be greater than 0',
      )
    })

    it('should throw an error when capacity is negative', async () => {
      const invalidDTO = {
        ...validEventDTO,
        capacity: -10, // ❌ Capacité négative
      }

      await expect(useCase.execute(invalidDTO)).rejects.toThrow(
        'capacity is required and must be greater than 0',
      )
    })
  })

  describe('Scenario: Invalid price', () => {
    it('should throw an error when price is negative', async () => {
      const invalidDTO = {
        ...validEventDTO,
        price: -5, // ❌ Prix négatif
      }

      await expect(useCase.execute(invalidDTO)).rejects.toThrow(
        'price is required and must be 0 or greater',
      )
    })
  })

  describe('Scenario: Payload is valid', () => {
    it('should save the event in the repository', async () => {
      const eventId = await useCase.execute(validEventDTO)

      // Vérifier que l'événement existe dans le repository
      const savedEvent = await repository.findById(eventId)

      expect(savedEvent).toBeDefined()
      expect(savedEvent?.getTitle()).toEqual(validEventDTO.title)
      expect(savedEvent?.getDescription()).toEqual(validEventDTO.description)
    })

    it('should return the ID of the created event', async () => {
      const eventId = await useCase.execute(validEventDTO)

      expect(eventId).toBeDefined()
      expect(typeof eventId).toBe('string')
      expect(eventId).toBe('test-event-123')
    })
  })
})
