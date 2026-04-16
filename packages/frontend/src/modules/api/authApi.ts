import axios, { type AxiosInstance } from 'axios'

export interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: string
      username: string
      email: string
    }
  }
}

export interface RegisterResponse {
  user: {
    id: string
    username: string
    email: string
  }
}

export class AuthApi {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // envoie automatique de cookie
    })
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/organizers/login', { email, password })
    return response.data
  }

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>('/organizers/register', {
      username,
      email,
      password,
    })
    return response.data
  }

  async logout(): Promise<void> {
    await this.client.post('/organizers/logout')
  }

  async verifyTOTPLogin(token: string): Promise<void> {
    await this.client.post('/a2f/verify', { token })
  }

  async useBackupCode(code: string): Promise<void> {
    await this.client.post('/backup-codes/use', { code })
  }
}
