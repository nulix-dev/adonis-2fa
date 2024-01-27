import * as twoFactor from 'node-2fa'

import { ResolvedTwoFactorAuthConfig, TwoFactorSecret } from './types.js'
import { randomInt } from 'node:crypto'

export class TwoFactorAuthManager {
  constructor(private config: ResolvedTwoFactorAuthConfig) {}

  /**
   * Generate a `Secret` to the given user information
   */
  generateSecret(userInfo: string): TwoFactorSecret {
    return twoFactor.generateSecret({
      name: this.config.issuer,
      account: userInfo,
    })
  }

  /**
   * Generate `n` recovery codes
   */
  generateRecoveryCodes(n = 16) {
    return Array.from({ length: n }, () => this.generateRecoveryCode(10))
  }

  /**
   * Verify if the OTP (One-Time password) is
   * valid to the user `secret`, or if the `recovery codes` includes the `otp`.
   */
  verifyToken(secret: string = '', token: string, recoveryCodes: string[] = []) {
    const verifyResult = twoFactor.verifyToken(secret, token)
    if (!verifyResult) {
      const isSecretInRecoveryCodes = recoveryCodes.includes(token)

      return isSecretInRecoveryCodes
    }

    return verifyResult.delta === 0 // Valida token atual, não permitindo token já expirado ou token futuro
  }

  /**
   * Generate a new token from a secret string
   */
  generateToken(secret: string) {
    return twoFactor.generateToken(secret)?.token
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

    const middleIndex = Math.floor(length / 2)
    recoveryCode = `${recoveryCode.substring(0, middleIndex)} ${recoveryCode.substring(middleIndex)}`

    return recoveryCode
  }
}
