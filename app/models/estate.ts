import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeFetch,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'
import File from '#models/file'
import Tenant from './tenant.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

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
  static async setTenant(data) {
    const ctx = HttpContext.getOrFail()

    const tenantId = ctx.request.headers()['x-tenant']

    data.tenantId = tenantId
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

  @column()
  declare tenantId: number

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @hasMany(() => File)
  declare files: HasMany<typeof File>

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
