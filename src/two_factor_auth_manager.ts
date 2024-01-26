import * as twoFactor from 'node-2fa'

import stringHelpers from '@adonisjs/core/helpers/string'
import { ResolvedTwoFactorAuthConfig } from './types.js'

export class TwoFactorAuthManager {
  constructor(private config: ResolvedTwoFactorAuthConfig) {}

  generateSecret(account: string) {
    return twoFactor.generateSecret({
      name: this.config.issuer,
      account,
    })
  }

  generateRecoveryCodes() {
    return Array.from({ length: 16 }, () => stringHelpers.generateRandom(10).toUpperCase())
  }

  verifyToken(secret: string = '', token: string, recoveryCodes: string[] = []) {
    const verifyResult = twoFactor.verifyToken(secret, token)
    if (!verifyResult) {
      const isSecretInRecoveryCodes = recoveryCodes.includes(token)

      return isSecretInRecoveryCodes
    }

    return verifyResult.delta === 0 // Valida token atual, não permitindo token já expirado ou token futuro
  }
}
