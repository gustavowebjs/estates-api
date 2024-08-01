import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, column } from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'

export default class Estate extends BaseModel {
  @beforeFetch()
  // @ts-ignore
  static async filterTenant(query) {
    const ctx = HttpContext.getOrFail()

    const tenant = ctx.request.headers()['x-tenant']

    query.where('tenant_id', tenant)
  }

  @beforeCreate()
  // @ts-ignore
  static async setTenant(user) {
    const ctx = HttpContext.getOrFail()

    user.tenantId = ctx.request.headers()['x-tenant']
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare published: boolean

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare zip: string

  @column()
  declare size: number

  @column()
  declare document_type: string

  @column()
  declare bedrooms: number

  @column()
  declare bathrooms: number

  @column()
  declare garages: number

  @column()
  declare type: EstateType

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

export enum EstateType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  LAND = 'land',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  OFFICE = 'office',
  RETAIL = 'retail',
  WAREHOUSE = 'warehouse',
  OTHER = 'other',
}
