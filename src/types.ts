/**
 * Config resolved by the "defineConfig" method
 */
export type ResolvedTwoFactorAuthConfig = {
  issuer: string
}

/**
 * `Secret` generated from `generateSecret` method
 */
export type TwoFactorSecret = {
  secret: string
  uri: string
  qr: string
}
