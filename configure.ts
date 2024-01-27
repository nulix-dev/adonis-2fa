/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  const shouldMakeMigration = await command.prompt.confirm(
    'Do you want to create a migration to save 2FA data?',
    {
      default: false,
      hint: 'You should be using @adonisjs/lucid',
    }
  )

  if (shouldMakeMigration) {
    const tableName = await command.prompt.ask('Enter table name you use to authentication: ', {
      default: 'users',
    })

    await codemods.makeUsingStub(stubsRoot, 'make/migration/add_2fa_fields.stub', {
      tableName,
      migration: {
        folder: 'database/migrations',
        fileName: `${new Date().getTime()}_add_2fa_fields_to_${tableName}_table.ts`,
      },
    })
  }

  /**
   * Publish config file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/2fa.stub', {})

  /**
   * Register provider
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@nulix/adonis-2fa/two_factor_auth_provider')
  })
}
