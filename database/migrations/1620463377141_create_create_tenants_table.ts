import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('logo')
      table.string('website')
      table.string('phone')
      table.text('description')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
