import { ITokenGenerator, TokenPayload } from '@/domain/interfaces/ITokenGenerator'

export class FakeTokenGenerator implements ITokenGenerator {
  generate(payload: TokenPayload): string {
    return `fake_token_${payload.userId}_${payload.role}`
  }

  verify(token: string): TokenPayload | null {
    const parts = token.split('_')
    if (parts.length < 4) return null
    return {
      userId: parts[2],
      email: 'test@test.com',
      role: parts[3],
    }
  }
}
