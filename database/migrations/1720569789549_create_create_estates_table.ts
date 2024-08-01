import { EstateType } from '#models/estate'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('published').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.float('price').notNullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('zip').nullable()
      table.float('size').nullable()
      table.string('document_type').nullable()
      table.integer('bedrooms').nullable()
      table.integer('bathrooms').nullable()
      table.integer('garages').nullable()
      table.enum('type', [EstateType.HOUSE, EstateType.APARTMENT, EstateType.LAND]).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
