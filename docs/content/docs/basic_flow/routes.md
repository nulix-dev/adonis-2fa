---
summary: How set Adonis-2FA Basic flow routes
---

# Routes

This is the routes that we recommend to the basic flow. This examples is for `api` projects, and can be adapted to `web` projects as well.

```ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const TwoFactorsController = () => import('#controllers/two_factor_auth_controller')

router
  .group(() => {
    router.post('generate', [TwoFactorsController, 'generate']).as('generate')
    router.post('verify', [TwoFactorsController, 'verify']).as('verify')
    router
      .post('generate-recovery-codes', [TwoFactorsController, 'generateRecoveryCodes'])
      .as('generate_recovery_codes')
    router.post('disable', [TwoFactorsController, 'disable']).as('disable')
  })
  .as('2fa')
  .prefix('2fa')
  .middleware(middleware.auth())
```

You can wrap this code in a function and call it inside your authenticated group of routes.

:::codegroup

```ts
// title: start/routes/2fa.ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const TwoFactorsController = () => import('#controllers/two_factor_auth_controller')

export function twoFactorAuthRoutes() {
  router
    .group(() => {
      router.post('generate', [TwoFactorsController, 'generate']).as('generate')
      router.post('verify', [TwoFactorsController, 'verify']).as('verify')
      router
        .post('generate-recovery-codes', [TwoFactorsController, 'generateRecoveryCodes'])
        .as('generate_recovery_codes')
      router.post('disable', [TwoFactorsController, 'disable']).as('disable')
    })
    .as('2fa')
    .prefix('2fa')
}
```

```ts
// title: start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import { twoFactorAuthRoutes } from './routes/2fa.js'

router
  .group(() => {
    // ...other routes
    twoFactorAuthRoutes()
  })
  .as('v1')
  .prefix('v1')
  .use(middleware.auth())
```

:::
