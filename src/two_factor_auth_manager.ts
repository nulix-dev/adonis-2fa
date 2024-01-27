import * as twoFactor from 'node-2fa'

import { ResolvedTwoFactorAuthConfig, TwoFactorSecret } from './types.js'
import { randomInt } from 'node:crypto'

export class TwoFactorAuthManager {
  constructor(private config: ResolvedTwoFactorAuthConfig) {}

  generateSecret(account: string): TwoFactorSecret {
    return twoFactor.generateSecret({
      name: this.config.issuer,
      account,
    })
  }

  generateRecoveryCodes(codeLength = 16) {
    return Array.from({ length: codeLength }, () => this.generateRecoveryCode(10))
  }

  verifyToken(secret: string = '', token: string, recoveryCodes: string[] = []) {
    const verifyResult = twoFactor.verifyToken(secret, token)
    if (!verifyResult) {
      const isSecretInRecoveryCodes = recoveryCodes.includes(token)

      return isSecretInRecoveryCodes
    }

    return verifyResult.delta === 0 // Valida token atual, não permitindo token já expirado ou token futuro
  }

  generateToken(secret: string) {
    return twoFactor.generateToken(secret)
  }

  private generateRandomChar() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const randomIndex = randomInt(0, charset.length)
    return charset[randomIndex]
  }

  private generateRecoveryCode(length: number) {
    let recoveryCode = ''

    for (let i = 0; i < length; i++) {
      recoveryCode += this.generateRandomChar()
    }

    // Inserir um espaço no meio
    const middleIndex = Math.floor(length / 2)
    recoveryCode = `${recoveryCode.substring(0, middleIndex)} ${recoveryCode.substring(middleIndex)}`

    return recoveryCode
  }
}
