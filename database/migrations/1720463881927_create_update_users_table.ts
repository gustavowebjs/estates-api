import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
