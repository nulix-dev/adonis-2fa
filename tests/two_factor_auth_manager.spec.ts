import { test } from '@japa/runner'
import { TwoFactorAuthManager } from '../index.js'
import { randomInt } from 'node:crypto'

const issuer = 'My app'
const numberOfSecretBytes = 20
const recoveryCodesLength = 16
const recoveryCodeSize = 10

test.group('TwoFactorAuthManager', () => {
  test('it should be able to create a Secret with 20 secret bytes', async ({ assert }) => {
    const email = 'johndoe@test.com'
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const twoFactorSecret = await manager.generateSecret(email)

    assert.properties(twoFactorSecret, ['secret', 'uri', 'qr'])
    assert.equal(twoFactorSecret.secret.length, 32)
    assert.include(twoFactorSecret.uri, encodeURIComponent(email))
    assert.include(twoFactorSecret.uri, encodeURIComponent(issuer))
  })

  test('it should be able to create a recovery codes', async ({ assert }) => {
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const recoveryCodes = manager.generateRecoveryCodes()

    assert.isArray(recoveryCodes)
    assert.lengthOf(recoveryCodes, 16)

    const recoveryCodeRegex = /^[A-Z0-9]{5}\s[A-Z0-9]{5}$/

    for (const code of recoveryCodes) {
      assert.isTrue(recoveryCodeRegex.test(code))
    }
  })

  test('it should be able to create n recovery codes', async ({ assert }) => {
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const length = randomInt(20)

    const recoveryCodes = manager.generateRecoveryCodes(length)

    assert.isArray(recoveryCodes)
    assert.lengthOf(recoveryCodes, length)
  })

  test('it should be able to verify a valid secret and OTP', async ({ assert }) => {
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const { secret } = await manager.generateSecret('any')

    const token = manager.generateToken(secret)!

    const [isValid, _isRecoveryToken] = manager.verifyToken(secret, token)

    assert.isTrue(isValid)
  })

  test('it not should be able to verify a valid secret and invalid OTP', async ({ assert }) => {
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const { secret } = await manager.generateSecret('any')

    const [isValid, _isRecoveryToken] = manager.verifyToken(secret, 'something')

    assert.isFalse(isValid)
  })

  test('it not should be able to verify a invalid secret and valid OTP', async ({ assert }) => {
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const { secret } = await manager.generateSecret('any')

    const token = manager.generateToken(secret)!

    const [isValid, _isRecoveryToken] = manager.verifyToken(secret + 'test', token)

    assert.isFalse(isValid)
  })

  test('it should be able to verify when OTP is a recovery code', async ({ assert }) => {
    const manager = new TwoFactorAuthManager({
      issuer,
      numberOfSecretBytes,
      recoveryCodeSize,
      recoveryCodesLength,
    })

    const recoveryCodes = manager.generateRecoveryCodes()

    const [_isValid, isRecoveryToken] = manager.verifyToken('any', recoveryCodes[0], recoveryCodes)

    assert.isTrue(isRecoveryToken)
  })
})
