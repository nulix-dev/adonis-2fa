/**
 * Config resolved by the "defineConfig" method
 */
export type ResolvedTwoFactorAuthConfig = {
  issuer: string
  /**
   * Number of authenticator secret bytes default is 20.
   *
   * @type {number}
   * @default 20
   */
  numberOfSecretBytes: number

  /**
   * The size of the recovery code.
   *
   * @type {number}
   * @default 32
   */
  recoveryCodeSize: number

  /**
   * The number of recovery codes available for a user's account.
   *
   * @type {number}
   * @default 10
   */
  recoveryCodesLength: number
}

export type TwoFactorAuthConfig = Partial<ResolvedTwoFactorAuthConfig> & {
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
