import { test } from '@japa/runner'
import { defineConfig } from '../index.js'
import app from '@adonisjs/core/services/app'

test.group('Config', () => {
  test('it should be able to make the package config', async ({ assert }) => {
    const issuer = 'My App'

    const config = await defineConfig({ issuer }).resolver(app)

    assert.properties(config, ['issuer'])
    assert.equal(config.issuer, issuer)
  })
})
