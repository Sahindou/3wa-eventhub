export interface EventProps {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  venueId: string
  capacity: number
  price: number
  organizerId: string
  categoryId: string
  imageUrl: string
  createdAt?: Date
  updatedAt?: Date
}

export class Event {
  private props: EventProps

  constructor(props: EventProps) {
    this.validateOrThrow(props)
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    }
  }

  private validateOrThrow(props: EventProps) {
    if (!props.title || props.title.trim() === '') {
      throw new Error('title is required')
    }
    if (!props.description || props.description.trim() === '') {
      throw new Error('description is required')
    }
    if (!props.startDate || props.startDate < new Date()) {
      throw new Error('startDate is required and must be in the future')
    }
    if (!props.venueId) {
      throw new Error('venueId is required')
    }
    if (!props.capacity || props.capacity <= 0) {
      throw new Error('capacity is required and must be greater than 0')
    }
    if (!props.price || props.price < 0) {
      throw new Error('price is required and must be 0 or greater')
    }
    if (!props.organizerId || props.organizerId.trim() === '') {
      throw new Error('organizerId is required')
    }
    if (!props.categoryId || props.categoryId.trim() === '') {
      throw new Error('categoryId is required')
    }
    // vérifier que la date de fin n'est pas avant la date de début
    if (this.hasInvalidDates(props)) {
      throw new Error('the end date must be after or equal to the current date.')
    }
  }

  // vérifier que la date de début n'est pas avant la date de fin
  hasInvalidDates(props: EventProps): boolean {
    return props.startDate >= props.endDate
  }

  getId(): string {
    return this.props.id
  }
  getTitle(): string {
    return this.props.title
  }
  getDescription(): string {
    return this.props.description
  }
  getIdOrganizer(): string {
    return this.props.organizerId
  }
  getIdCategory(): string {
    return this.props.categoryId
  }
  getStartDate(): Date {
    return this.props.startDate
  }
  getEndDate(): Date {
    return this.props.endDate
  }
  getIdVenue(): string {
    return this.props.venueId
  }
  getCapacity(): number {
    return this.props.capacity
  }
  getPrice(): number {
    return this.props.price
  }
  getImageUrl(): string {
    return this.props.imageUrl
  }
  getCreatedAt(): Date {
    return this.props.createdAt || new Date()
  }
  getUpdatedAt(): Date {
    return this.props.updatedAt || new Date()
  }
}
