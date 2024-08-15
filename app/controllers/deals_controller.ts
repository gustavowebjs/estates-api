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

    const query = Deal.query().orderBy('position', 'asc').preload('contact')

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

  async updatePosition({ request, params }: HttpContext) {
    const { funnel_id, destination_index } = request.only(['funnel_id', 'destination_index'])

    // Find the deal that needs to be updated
    const deal = await Deal.findOrFail(params.id)

    // Retrieve all deals from the destination funnel ordered by position
    const dealsInFunnel = await Deal.query()
      .where('funnel_id', funnel_id)
      .orderBy('position', 'asc')

    let newPosition: number

    // If moving to the top of the column
    if (destination_index === 0) {
      newPosition = dealsInFunnel[0]?.position / 2 || 1.0
    }
    // If moving to the bottom of the column
    else if (destination_index >= dealsInFunnel.length) {
      newPosition = dealsInFunnel[dealsInFunnel.length - 1]?.position + 1 || 1.0
    }
    // If moving between two deals in the middle of the column
    else {
      const prevDealPosition = dealsInFunnel[destination_index - 1].position
      const nextDealPosition = dealsInFunnel[destination_index].position
      newPosition = (prevDealPosition + nextDealPosition) / 2
    }

    // Update deal position and funnel if it's moved to a different funnel
    deal.position = newPosition
    deal.funnelId = funnel_id
    await deal.save()

    return deal
  }

  async destroy({ params }: HttpContext) {
    const deal = await Deal.findOrFail(params.id)

    await deal.delete()
  }
}
