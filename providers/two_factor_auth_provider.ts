import type { ApplicationService } from '@adonisjs/core/types'

import { TwoFactorAuthManager } from '../src/two_factor_auth_manager.js'
import { ResolvedTwoFactorAuthConfig } from '../src/types.js'
import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'

/**
 * Extending AdonisJS types
 */
declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    two_factor_auth: TwoFactorAuthManager
  }
}

export default class TwoFactorAuthProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('two_factor_auth', async () => {
      const twoFactorConfigProvider = this.app.config.get<ResolvedTwoFactorAuthConfig>('2fa')

      /**
       * Resolve config from the provider
       */
      const config = await configProvider.resolve<any>(this.app, twoFactorConfigProvider)
      if (!config) {
        throw new RuntimeException(
          'Invalid "config/2fa.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new TwoFactorAuthManager(config)
    })
  }
}
