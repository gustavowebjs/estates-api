import type { HttpContext } from '@adonisjs/core/http'
import Funnel from '#models/funnel'

export default class FunnelsController {
  async store({ request }: HttpContext) {
    const data = request.only(['name', 'order'])

    const funnel = await Funnel.create(data)

    return funnel
  }

  async index() {
    const funnels = await Funnel.query().orderBy('order', 'asc')

    return funnels
  }

  async update({ request, params }: HttpContext) {
    const funnel = await Funnel.findOrFail(params.id)

    const data = request.only(['name', 'order'])

    funnel.merge(data)

    await funnel.save()

    return funnel
  }

  async destroy({ params }: HttpContext) {
    const funnel = await Funnel.findOrFail(params.id)

    await funnel.delete()
  }
}
