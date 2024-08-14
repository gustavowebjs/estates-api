import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deals'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('funnel_id').unsigned().references('id').inTable('funnels').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('funnel_id')
    })
  }
}
