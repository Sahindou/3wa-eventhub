export interface OrganizerProps {
  id: string
  user_id: string
  company_name: string
  siret: string
  description: string
  is_verified: boolean
  rating: number
  createdAt: Date
}

export class Organizer {
  private props: OrganizerProps

  constructor(props: OrganizerProps) {
    this.validateOrThrow(props)
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    }
  }

  private validateOrThrow(props: OrganizerProps): void {
    if (!props.user_id || props.user_id.trim() === '') {
      throw new Error('user_id is required')
    }

    if (!props.company_name || props.company_name.trim() === '') {
      throw new Error('company_name is required')
    }
    if (!props.siret || props.siret.trim() === '') {
      throw new Error('siret is required')
    }
    if (!props.description || props.description.trim() === '') {
      throw new Error('description is required')
    }
  }

  // Getters
  getProps(): OrganizerProps {
    return this.props
  }

  // Méthodes métier
  verify(): void {
    this.props.is_verified = true
  }
}
