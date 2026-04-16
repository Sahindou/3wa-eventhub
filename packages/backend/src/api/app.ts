import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { routers } from './routes'
import { errorHandlerMiddleware, jsonApiResponseMiddleware } from './middlewares'
import swaggerOptions from './config/swagger.config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'

const app = express()

// ── Connexion MongoDB (Analytics) ──────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('✅ MongoDB connected (analytics)'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))
// ───────────────────────────────────────────────────────────────────────────

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// autorisation des credentials
app.use(
  cors({
    origin: env.ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(jsonApiResponseMiddleware)

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(routers)

app.use(errorHandlerMiddleware)

app.listen(8000, () => {
  console.log('✅ Server is running on port 8000')
  console.log('📚 Swagger docs available at http://localhost:8000/api-docs')
})
