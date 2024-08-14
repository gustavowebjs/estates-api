/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContext } from '@adonisjs/core/http'

import Deal from '#models/deal'

export default class DealsController {
  async store({ request }: HttpContext) {
    const data = request.only([
      'name',
      'description',
      'value',
      'user_id',
      'contact_id',
      'funnel_id',
    ])

    const deal = await Deal.create(data)

    return deal
  }

  async index({ request }: HttpContext) {
    const { name, page = 1, pageSize = 25, funnel_id, userId } = request.qs()

    const query = Deal.query().preload('contact')

    if (name) {
      query.where('name', 'like', `%${name}%`)
    }

    if (userId) {
      query.where('userId', userId)
    }

    if (funnel_id) {
      query.where('funnel_id', funnel_id)
    }

    const deals = await query.paginate(page, pageSize)

    return deals
  }

  async show({ params }: HttpContext) {
    const deal = await Deal.findOrFail(params.id)

    return deal
  }

  async update({ request, params }: HttpContext) {
    const deal = await Deal.findOrFail(params.id)

    const data = request.only([
      'name',
      'description',
      'value',
      'user_id',
      'contact_id',
      'funnel_id',
    ])

    deal.merge(data)

    await deal.save()

    return deal
  }

  async destroy({ params }: HttpContext) {
    const deal = await Deal.findOrFail(params.id)

    await deal.delete()
  }
}
