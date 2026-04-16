export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export interface ITokenGenerator {
  generate(payload: TokenPayload): string
  verify(token: string): TokenPayload | null
}
