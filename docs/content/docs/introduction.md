---
summary: Adonis-2FA is a library for managing Two Factor Authentication in your AdonisJS project.
---

# Introduction

Adonis-2FA is a library for managing Two Factor Authentication in your AdonisJS project build on top of [2fa-node](https://github.com/FinotiLucas/2fa-node).

The package it self does not store any secret or data on your behalf. It only give you access the methods to implement a two factor authentication flow and create recovery codes. You can store that information inside a database and use the [auth](https://docs.adonisjs.com/guides/auth) package to login the user within your application.

But you can generate some sample codes like migrations and API controllers/routes to give you some ideas on how to implement your [2FA flow](https://saaswebsites.com/userflow-articles/two-factor-authentication-2fa-user-flow-examples-and-tips/).

## Installation

Install the package from the npm packages registry using one of the following commands.

:::codegroup

```sh
// title: npm
npm i @nulix/adonis-2fa
```

```sh
// title: yarn
yarn add @nulix/adonis-2fa
```

```sh
// title: pnpm
pnpm add @nulix/adonis-2fa
```

:::

Once the package is installed, you must configure it using the `node ace configure` command.

```sh
node ace configure @nulix/adonis-2fa
```

:::disclosure{title="See steps performed by the configure command"}

1. Registers the following service provider inside the `adonisrc.ts` file.

   ```ts
   {
     providers: [
       // ...other providers
       () => import('@nulix/adonis-2fa/two_factor_auth_provider'),
     ]
   }
   ```

2. If you choose to create migration, creates database migration for your authentication table (ex: `users`).

3. If you choose to create basic API 2FA flow, creates controller, routes and validation to a basic 2FA flow.

4. Create the `config/2fa.ts` file.

:::

## Configuration

The configuration for 2FA is stored inside the `config/2fa.ts` file.

See also: [Adonis-2FA config stubs](https://github.com/nulix-dev/adonis-2fa/blob/develop/stubs/config/2fa.stub)

```ts
import env from '#start/env'
import { defineConfig } from '@nulix/adonis-2fa'

const twoFactorAuthConfig = defineConfig({
  issuer: env.get('APP_ISSUER', 'adonis'),
})

export default twoFactorAuthConfig
```

<dl>

<dt>

issuer

</dt>

<dd>

The name of your application that will show in the user 2FA Authenticator.

</dd>

</dl>
