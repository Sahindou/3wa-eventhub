import { v4 as uuidv4 } from 'uuid'
import { IIdGenerator } from '../../domain/interfaces/IIdGenerator'

export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4() // Génère un UUID v4
  }
}
