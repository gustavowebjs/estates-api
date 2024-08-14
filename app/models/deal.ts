import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeFetch, belongsTo, column } from '@adonisjs/lucid/orm'
import { HttpContext } from '@adonisjs/core/http'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Contact from './contact.js'
import Funnel from './funnel.js'

export default class Deal extends BaseModel {
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
  declare description: string | null

  @column()
  declare value: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare contactId: number

  @belongsTo(() => Contact)
  declare contact: BelongsTo<typeof Contact>

  @column()
  declare funnelId: number
  declare funnel: BelongsTo<typeof Funnel>

  @column()
  declare tenant_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
