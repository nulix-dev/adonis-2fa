/**
 * Config resolved by the "defineConfig" method
 */
export type ResolvedTwoFactorAuthConfig = {
  issuer: string
}

export type TwoFactorSecret = {
  secret: string
  uri: string
  qr: string
}
