import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('CASCADE')
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
