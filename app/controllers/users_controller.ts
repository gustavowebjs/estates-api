import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class UsersController {
  async store({ request }: HttpContext) {
    const data = request.only(['name', 'email', 'password', 'tenant_id'])

    const user = await User.create(data)

    return user
  }

  async index({ request }: HttpContext) {
    const { name, page = 1, pageSize = 25 } = request.qs()

    const query = User.query()

    if (name) {
      query.where('name', 'like', `%${name}%`)
    }

    const users = await query.paginate(page, pageSize)

    return users
  }

  async update({ request, params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const data = request.only(['username', 'email', 'password'])

    user.merge(data)

    await user.save()

    return user
  }

  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()
  }
}
