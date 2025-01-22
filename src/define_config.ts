import { configProvider } from '@adonisjs/core'
import type { ConfigProvider } from '@adonisjs/core/types'
import { ResolvedTwoFactorAuthConfig, TwoFactorAuthConfig } from './types.js'

/**
 * Define configuration for the 2fa package. The function returns
 * a config provider that is invoked inside the auth service
 * provider
 */
export function defineConfig(
  config: TwoFactorAuthConfig
): ConfigProvider<ResolvedTwoFactorAuthConfig> {
  return configProvider.create<ResolvedTwoFactorAuthConfig>(async () => {
    return {
      issuer: config.issuer,
      numberOfSecretBytes: config.numberOfSecretBytes || 20,
      recoveryCodeSize: config.recoveryCodeSize || 10,
      recoveryCodesLength: config.recoveryCodesLength || 16,
    }
  })
}
