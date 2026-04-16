import swaggerJsdoc from 'swagger-jsdoc'
import fs from 'fs'
import swaggerOptions from '../src/api/config/swagger.config'

const swaggerSpec = swaggerJsdoc(swaggerOptions)
fs.writeFileSync('./docs/swagger-output.json', JSON.stringify(swaggerSpec, null, 2))

console.log('Fichier Swagger généré : swagger-output.json')
