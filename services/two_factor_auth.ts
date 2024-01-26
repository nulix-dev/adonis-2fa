import app from '@adonisjs/core/services/app'
import { TwoFactorAuthManager } from '../src/two_factor_auth_manager.js'

let twoFactorAuth: TwoFactorAuthManager

/**
 * Returns a singleton instance of the Database class from the
 * container
 */
await app.booted(async () => {
  twoFactorAuth = await app.container.make('two_factor_auth')
})

export { twoFactorAuth as default }
