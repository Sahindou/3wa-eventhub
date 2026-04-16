/**
 * Configuration des variables d'environnement pour l'API
 * Utilise process.env (Node.js)
 */

export interface ApiEnv {
  PORT: number
  NODE_ENV: string
  DATABASE_URL: string
  API_URL: string
  ORIGIN: string
  JWT_SECRET: string
  APP_NAME: string
}

function getEnv(): ApiEnv {
  return {
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || '',
    API_URL: process.env.VITE_API_URL || process.env.API_URL || '',
    ORIGIN: process.env.ORIGIN || 'http://localhost:5173',
    JWT_SECRET: process.env.JWT_SECRET || 'mon_mot_de_passe_hyper_secret_let_s_go',
    APP_NAME: process.env.APP_NAME || 'Eventhub',
  }
}

export const env = getEnv()

export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
