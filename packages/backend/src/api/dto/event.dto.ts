export interface CreateEventInputs {
  title: string
  description: string
  startDate: Date
  endDate: Date
  venueId: string // mettre le type avec sa class
  capacity: number
  price: number
  organizerId: string // mettre le type avec sa class
  categoryId: string // mettre le type avec sa class
  imageUrl: string
}
