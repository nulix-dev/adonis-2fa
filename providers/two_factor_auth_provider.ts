import type { ApplicationService } from '@adonisjs/core/types'

import { TwoFactorAuthManager } from '../src/two_factor_auth_manager.js'
import { ResolvedTwoFactorAuthConfig } from '../src/types.js'

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
    this.app.container.singleton('two_factor_auth', () => {
      const config = this.app.config.get<ResolvedTwoFactorAuthConfig>('2fa')

      return new TwoFactorAuthManager(config)
    })
  }
}
