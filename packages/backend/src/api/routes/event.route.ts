import { Router } from 'express'
import { EventController } from '@/api/controllers/'
import { CreateEventUseCase } from '../../application/usecases/CreateEventUseCase'
import { EventRepositoryDatabase } from '@/infrastructure/repositories/'
import { UuidGenerator } from '../../infrastructure/id-generators/UuidGenerator'
import { authMiddleware, requireRole } from '@/api/middlewares/authentication.middleware'

const router = Router()

// 1. Créer les dépendances
const eventRepository = new EventRepositoryDatabase()
const idGenerator = new UuidGenerator()

// 2. Créer le Use Case
const createEventUseCase = new CreateEventUseCase(eventRepository, idGenerator)

// 3. Créer le Controller
const eventController = new EventController(createEventUseCase, eventRepository)

// ===== DÉFINIR LES ROUTES =====

// GET /api/events - lister tous les événements (protégé)
router.get('/', authMiddleware, eventController.getAll.bind(eventController))
// POST /api/events - Créer un événement (protégé: organizer uniquement)
router.post(
  '/',
  authMiddleware,
  requireRole('organizer'),
  eventController.create.bind(eventController),
)

export { router as EventRouter }
