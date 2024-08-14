import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.decimal('value', 10, 2).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table
        .integer('contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('SET NULL')
      table.boolean('status').defaultTo(null)
      table.integer('tenant_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
