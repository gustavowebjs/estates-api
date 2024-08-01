import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, beforeCreate, beforeFetch, belongsTo, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Tenant from './tenant.js'
import { HttpContext } from '@adonisjs/core/http'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
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
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare tenantId: number

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
