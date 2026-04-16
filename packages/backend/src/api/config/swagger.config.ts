const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eventhub API',
      version: '1.0.0',
      description: "Documentation de l'API Eventhub - Plateforme de gestion d'événements",
    },
    servers: [
      {
        url: 'http://localhost:8000/api',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            role: { type: 'string', enum: ['organizer', 'user'] },
          },
        },
        RegisterOrganizerRequest: {
          type: 'object',
          required: [
            'email',
            'password',
            'first_name',
            'last_name',
            'phone',
            'company_name',
            'siret',
            'description',
          ],
          properties: {
            email: { type: 'string', format: 'email', example: 'organizer@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '0612345678' },
            profile_image: { type: 'string', nullable: true },
            company_name: { type: 'string', example: 'Ma Société' },
            siret: { type: 'string', example: '12345678901234' },
            description: { type: 'string', example: "Description de l'entreprise" },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'organizer@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        CreateEventRequest: {
          type: 'object',
          required: [
            'title',
            'description',
            'startDate',
            'endDate',
            'venueId',
            'capacity',
            'price',
            'categoryId',
            'imageUrl',
          ],
          properties: {
            title: { type: 'string', example: 'Concert de Jazz' },
            description: { type: 'string', example: 'Un super concert de jazz' },
            startDate: { type: 'string', format: 'date-time', example: '2026-02-15T20:00:00Z' },
            endDate: { type: 'string', format: 'date-time', example: '2026-02-15T23:00:00Z' },
            venueId: { type: 'string', format: 'uuid' },
            capacity: { type: 'integer', example: 500 },
            price: { type: 'number', example: 25.5 },
            categoryId: { type: 'string', format: 'uuid' },
            imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./docs/routes/*.yaml'],
}

export default swaggerOptions
