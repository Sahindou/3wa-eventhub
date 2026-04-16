import { NextFunction, Request, Response } from 'express'
import { generateSecret } from 'otplib'
import { QrCodeGenerator } from '@/api/utils/qr-code-generator'
import { VerifyOtpUseCase } from '@/application/usecases/VerifyOtpUseCase'
import { GenerateBackupCodesUseCase } from '@/application/usecases/GenerateBackupCodesUseCase'
import { UseBackupCodeUseCase } from '@/application/usecases/UseBackupCodeUseCase'
import { UserRepositoryDatabase } from '@/infrastructure/repositories/UserRepositoryDatabase'
import { OtpBackupCodeRepositoryDatabase } from '@/infrastructure/repositories/OtpBackupCodeRepositoryDatabase'

export const qrCode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.user) {
      return res.jsonError("Vous n'êtes pas connecté", 401)
    }

    const secret = generateSecret()
    const qrCodeGenerator = new QrCodeGenerator()
    const qrCode = await qrCodeGenerator.generate(req.user.email, secret)

    return res.jsonSuccess({ qrCode }, 200)
  } catch (error) {
    next(error)
  }
}

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.user) {
      return res.jsonError("Vous n'êtes pas connecté", 401)
    }

    const { token, secret } = req.body

    const verifyOtpUseCase = new VerifyOtpUseCase(new UserRepositoryDatabase())
    const mode = await verifyOtpUseCase.execute({ userId: req.user.userId, token, secret })

    if (mode === 'activation') {
      const generateBackupCodesUseCase = new GenerateBackupCodesUseCase(
        new OtpBackupCodeRepositoryDatabase(),
        new UserRepositoryDatabase(),
      )
      const backupCodes = await generateBackupCodesUseCase.execute(req.user.userId)

      return res.jsonSuccess(
        {
          message: 'A2F activée avec succès',
          backupCodes,
        },
        200,
      )
    }

    return res.jsonSuccess({ message: 'Code OTP valide' }, 200)
  } catch (error) {
    next(error)
  }
}

export const generateBackupCodes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.jsonError("Vous n'êtes pas connecté", 401)
    }

    const useCase = new GenerateBackupCodesUseCase(
      new OtpBackupCodeRepositoryDatabase(),
      new UserRepositoryDatabase(),
    )
    const codes = await useCase.execute(req.user.userId)

    return res.jsonSuccess(
      {
        message: 'Codes de récupération générés. Sauvegardez-les, ils ne seront plus affichés.',
        codes,
      },
      201,
    )
  } catch (error) {
    next(error)
  }
}

export const useBackupCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.jsonError("Vous n'êtes pas connecté", 401)
    }

    const { code } = req.body

    if (!code) {
      return res.jsonError('Le code de récupération est requis', 400)
    }

    const useCase = new UseBackupCodeUseCase(new OtpBackupCodeRepositoryDatabase())
    await useCase.execute({ userId: req.user.userId, code })

    return res.jsonSuccess({ message: 'Code de récupération valide. Accès accordé.' }, 200)
  } catch (error) {
    next(error)
  }
}
