---
summary: How to use Adonis-2FA
---

# Usage

Once the package has been configured, you can interact with 2FA API's using the service to create `Secret` and `Recovery Codes` to the user and validate the OTP (One-time password).

All the examples below will be using Lucid as database store, and Adonis Auth as a way to retrieve the authenticated user. If that is not your case, you can use the examples as a guide to make it in your own situation.

## Creating a user Secret

The very first step is to create a `Secret` to user.

The `Secret` is an object containing a 32-character `secret` (keep user specific), a `uri` (if you want to make your own QR / barcode) and a `direct link` to a QR code served via HTTPS by the Google Chart API.

To create that we should call the `generateSecret` method passing some user information, like an `email` or `username`, that will also show up in the user's authenticator app.

```ts
import type { HttpContext } from '@adonisjs/core/http'

import twoFactorAuth from '@nulix/adonis-2fa/services/main'

export default class TwoFactorAuthController {
  async generate({ auth }: HttpContext) {
    const user = auth.user!

    // highlight-start
    user.twoFactorSecret = twoFactorAuth.generateSecret(user.email)
    // highlight-end
    /*
    {
      secret: 'XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W',
      uri: 'otpauth://totp/My%20Awesome%20App:johndoe@test.com?secret=XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W&issuer=My%20Awesome%20App',
      qr: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/My%20Awesome%20App:johndoe%3Fsecret=XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W%26issuer=My%20Awesome%20App'
    }
    */

    await user.save()

    return user.twoFactorSecret
  }
}
```

As a good practice, you should store that object encrypted in the database. You can use the Adonis [encryption](https://docs.adonisjs.com/guides/encryption) service to encrypt and decrypt.

If you are using [Lucid](https://lucid.adonisjs.com/docs/introduction), you can automate this process in your `User` model for example:

```ts
// ...other imports
import encryption from '@adonisjs/core/services/encryption'
import { TwoFactorSecret } from '@nulix/adonis-2fa/types'

export default class User extends compose(BaseModel, AuthFinder) {
  // ...other user columns

  // highlight-start
  @column({
    consume: (value: string) => (value ? encryption.decrypt(value) : null),
    prepare: (value: string) => encryption.encrypt(value),
  })
  declare twoFactorSecret: TwoFactorSecret | null
  // highlight-end
}
```

## Generate Recovery Codes

If you don't know what is a recovery code, or why are they important, please read this [article](https://support.authy.com/hc/en-us/articles/1260803525789-What-is-a-Recovery-or-Backup-Code). Simply put, in case that your user lost their authenticator app, they can user the recovery code to access your project and maybe create another `Secret`.

To create them we should call the `generateRecoveryCodes` method. As default, it will create 16 codes. If you want to change that, you can pass the `number` as an argument of the method.

```ts
import type { HttpContext } from '@adonisjs/core/http'

import twoFactorAuth from '@nulix/adonis-2fa/services/main'

export default class TwoFactorAuthController {
  async generateRecoveryCodes({ auth }: HttpContext) {
    const user = auth.user!

    // highlight-start
    user.twoFactorRecoveryCodes = twoFactorAuth.generateRecoveryCodes() // or .generateRecoveryCodes(32)
    // highlight-end
    // ['XMCIM 5WAGK', 'MYM50 GHZJW', 'YWCHF 0TWRE', ...]

    await user.save()

    return { recovery_codes: user.twoFactorRecoveryCodes }
  }
}
```

You should store that array encrypted as well in the database just like the `Secret`. `User` model example:

```ts
// ...other imports
import encryption from '@adonisjs/core/services/encryption'

export default class User extends compose(BaseModel, AuthFinder) {
  // ...other user columns

  // highlight-start
  @column({
    consume: (value: string) => (value ? encryption.decrypt(value) : []),
    prepare: (value: string[]) => encryption.encrypt(value),
  })
  declare twoFactorRecoveryCodes: string[]
  // highlight-end
}
```

## Verify OTP

To verify the OTP (One-time password) we should use the `verifyToken` method passing the user `32-character secret`, the `otp` string that he is trying to verify and his array of `recovery codes`.

```ts
import type { HttpContext } from '@adonisjs/core/http'

import twoFactorAuth from '@nulix/adonis-2fa/services/main'

export default class TwoFactorAuthController {
  async verify({ auth, request, response }: HttpContext) {
    const otp = await request.input('otp')

    const user = auth.user!

    // highlight-start
    const isValid = twoFactorAuth.verifyToken(
      user.twoFactorSecret?.secret,
      otp,
      user.twoFactorRecoveryCodes
    )
    // highlight-end

    if (!isValid) {
      return response.badRequest({ message: 'OTP invalid' })
    }

    return response.ok({ message: 'OTP valid' })
  }
}
```

This method will try to verify if the `otp` is valid to the user `secret`, or if the `recovery codes` includes the otp.
