import qrcode from 'qrcode'
import { generateURI } from 'otplib'
import { type iQrCode } from './interfaces/qr-code-generrator.interface'
import { env } from '../config/env'

export class QrCodeGenerator implements iQrCode {
  private readonly appName: string
  constructor() {
    this.appName = env.APP_NAME
  }

  async generate(username: string, secret: string) {
    const uri = generateURI({ strategy: 'totp', issuer: this.appName, label: username, secret })
    const image = await qrcode.toDataURL(uri)
    return { image, username, secret }
  }
}
