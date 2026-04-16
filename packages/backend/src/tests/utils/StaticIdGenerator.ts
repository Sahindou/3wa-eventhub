import { IIdGenerator } from '@/domain/interfaces/IIdGenerator'

export class StaticIdGenerator implements IIdGenerator {
  generate(): string {
    return 'test-event-123' // ID fixe pour les tests
  }
}
