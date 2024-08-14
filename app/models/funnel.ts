import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, column, hasMany } from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Deal from './deal.js'

export default class Funnel extends BaseModel {
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

    console.log('data', data)
    data.tenant_id = ctx.request.headers()['x-tenant']
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare order: number

  @hasMany(() => Deal)
  declare deals: HasMany<typeof Deal>

  @column()
  declare tenant_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
