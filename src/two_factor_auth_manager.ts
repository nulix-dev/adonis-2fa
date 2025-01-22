import * as twoFactor from '2fa-node'
import { ResolvedTwoFactorAuthConfig, TwoFactorSecret } from './types.js'
import { randomInt } from 'node:crypto'

export class TwoFactorAuthManager {
  constructor(private config: ResolvedTwoFactorAuthConfig) {}

  /**
   * Generate a `Secret` to the given user information
   */
  async generateSecret(userInfo: string): Promise<TwoFactorSecret> {
    return await twoFactor.generateSecret({
      name: this.config.issuer,
      account: userInfo,
      counter: undefined,
      numberOfSecretBytes: this.config.numberOfSecretBytes,
    })
  }

  /**
   * Generate `n` recovery codes
   */
  generateRecoveryCodes(n?: number) {
    const length = n || this.config.recoveryCodesLength
    return Array.from({ length: length }, () =>
      this.generateRecoveryCode(this.config.recoveryCodeSize)
    )
  }

  /**
   * Verify if the OTP (One-Time password) is
   * valid to the user `secret`, or if the `recovery codes` includes the `otp`.
   */
  verifyToken(secret: string = '', token: string, recoveryCodes: string[] = []): boolean[] {
    const verifyResult = twoFactor.verifyToken(secret, token)
    if (!verifyResult) {
      return [false, this.isTokenInRecoveryCodes(recoveryCodes, token)]
    }
    return [true, false]
  }

  /**
   * Check if a token one of the recovery tokens
   */
  private isTokenInRecoveryCodes(recoveryCodes: string[], token: string) {
    return recoveryCodes.includes(token)
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
