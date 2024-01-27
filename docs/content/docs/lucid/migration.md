---
summary: How set Adonis-2FA Lucid Migration
---

# Migration

If you choose to create the migration in the `configure` step or if you want to configure by your self, this is the base migration that we use for the basic flow.

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users' // or your authentication table

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_two_factor_enabled').defaultTo(false)
      table.text('two_factor_secret').nullable()
      table.text('two_factor_recovery_codes').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('is_two_factor_enabled', 'two_factor_secret', 'two_factor_recovery_codes')
    })
  }
}
```
