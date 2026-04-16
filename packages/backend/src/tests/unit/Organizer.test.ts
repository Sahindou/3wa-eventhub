import { Organizer } from '@/domain/entities/Organizer'

const validProps = {
  id: 'org-1',
  user_id: 'user-1',
  company_name: 'EventPro SARL',
  siret: '12345678901234',
  description: "Organisateur d'événements professionnels",
  is_verified: false,
  rating: 0,
  createdAt: new Date(),
}

describe('Organizer entity', () => {
  describe('Validation', () => {
    it('should create a valid organizer', () => {
      const organizer = new Organizer(validProps)
      expect(organizer.getProps().company_name).toBe('EventPro SARL')
    })

    it('should throw when user_id is empty', () => {
      expect(() => new Organizer({ ...validProps, user_id: '' })).toThrow('user_id is required')
    })

    it('should throw when company_name is empty', () => {
      expect(() => new Organizer({ ...validProps, company_name: '' })).toThrow(
        'company_name is required',
      )
    })

    it('should throw when siret is empty', () => {
      expect(() => new Organizer({ ...validProps, siret: '' })).toThrow('siret is required')
    })

    it('should throw when description is empty', () => {
      expect(() => new Organizer({ ...validProps, description: '' })).toThrow(
        'description is required',
      )
    })
  })

  describe('Business methods', () => {
    it('should set is_verified to true after verify()', () => {
      const organizer = new Organizer(validProps)
      organizer.verify()
      expect(organizer.getProps().is_verified).toBe(true)
    })
  })
})
