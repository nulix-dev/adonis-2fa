import { configProvider } from '@adonisjs/core'
import type { ConfigProvider } from '@adonisjs/core/types'
import { ResolvedTwoFactorAuthConfig } from './types.js'

/**
 * Define configuration for the 2fa package. The function returns
 * a config provider that is invoked inside the auth service
 * provider
 */
export function defineConfig(config: {
  issuer: string
}): ConfigProvider<ResolvedTwoFactorAuthConfig> {
  return configProvider.create(async () => {
    return {
      issuer: config.issuer,
    } as ResolvedTwoFactorAuthConfig
  })
}
