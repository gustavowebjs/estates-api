import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tenant_id').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
