import jwt, { SignOptions } from 'jsonwebtoken'
import { ITokenGenerator, TokenPayload } from '@/domain/interfaces/ITokenGenerator'

export class JwtTokenGenerator implements ITokenGenerator {
  private readonly secret: string
  private readonly expiresIn: number

  constructor(secret: string, expiresInSeconds: number = 86400) {
    // 24h = 86400 secondes
    this.secret = secret
    this.expiresIn = expiresInSeconds
  }

  generate(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn }
    return jwt.sign(payload, this.secret, options)
  }

  verify(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as TokenPayload
    } catch {
      return null
    }
  }
}
