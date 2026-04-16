import axios, { type AxiosInstance } from 'axios'
import type { UserProfile } from '../../features/user-profile/store/userSlice'

export interface TwoFactorSetupResponse {
  data: {
    qrCode: {
      image: string
      username: string
      secret: string
    }
  }
}

export interface BackupCodesResponse {
  data: {
    backupCodes: string[]
  }
}

export interface VerifyOtpResponse {
  data: {
    message: string
    backupCodes: string[]
  }
}

export class ProfileApi {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // envoie automatiquement le cookie httpOnly
    })
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>(`/organizers/me`)
    return response.data
  }

  async updateProfile(
    id: string,
    updates: { data: Partial<UserProfile['data']> },
  ): Promise<UserProfile> {
    const response = await this.client.patch<UserProfile>(`/organizers/${id}`, updates)
    return response.data
  }

  async setup2FA(): Promise<TwoFactorSetupResponse> {
    const response = await this.client.get<TwoFactorSetupResponse>(`/a2f/qrcode`)
    return response.data
  }

  async verify2FA(token: string, secret: string): Promise<VerifyOtpResponse> {
    const response = await this.client.post<VerifyOtpResponse>(`/a2f/verify`, { token, secret })
    return response.data
  }

  async generateBackupCodes(): Promise<BackupCodesResponse> {
    const response = await this.client.post<BackupCodesResponse>(`/a2f/backup-codes/generate`)
    return response.data
  }
}
