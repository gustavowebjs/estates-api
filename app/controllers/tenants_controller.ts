import Tenant from '#models/tenant'
import type { HttpContext } from '@adonisjs/core/http'

export default class TenantsController {
  async index() {
    return await Tenant.all()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'logo', 'website', 'description'])

    const tenant = await Tenant.create(data)

    return response.status(201).send(tenant)
  }

  async update({ request, params }: HttpContext) {
    const tenant = await Tenant.findOrFail(params.id)

    const data = request.only(['name', 'logo', 'website', 'description'])

    tenant.merge(data)

    await tenant.save()

    return tenant
  }

  async destroy({ params }: HttpContext) {
    const tenant = await Tenant.findOrFail(params.id)

    await tenant.delete()
  }
}
