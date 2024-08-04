import { HttpContext } from '@adonisjs/core/http'
import { BaseModel, beforeCreate, beforeFetch, belongsTo, column } from '@adonisjs/lucid/orm'
import Tenant from './tenant.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Estate from './estate.js'

export default class File extends BaseModel {
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
  declare name: string

  @column()
  declare url: string

  @column()
  declare tenantId: number

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @column()
  declare estateId: number

  @belongsTo(() => Estate)
  declare estate: BelongsTo<typeof Estate>
}
