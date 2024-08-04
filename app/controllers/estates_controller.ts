import Estate from '#models/estate'
import type { HttpContext } from '@adonisjs/core/http'

export default class EstatesController {
  async index({}: HttpContext) {
    const query = Estate.query()

    const estates = await query.preload('files').paginate(1, 10)

    return estates
  }

  async show({ params }: HttpContext) {
    const query = Estate.query().where('id', params.id).preload('files')

    const estate = await query.firstOrFail()

    return estate
  }

  async store({ request }: HttpContext) {
    const data = request.only([
      'published',
      'title',
      'description',
      'price',
      'address',
      'city',
      'state',
      'zip',
      'size',
      'document_type',
      'bedrooms',
      'bathrooms',
      'garages',
      'type',
    ])

    const estate = await Estate.create(data)

    return estate
  }

  async update({ params, request }: HttpContext) {
    const estate = await Estate.findOrFail(params.id)

    const data = request.only([
      'published',
      'title',
      'description',
      'price',
      'address',
      'city',
      'state',
      'zip',
      'size',
      'document_type',
      'bedrooms',
      'bathrooms',
      'garages',
      'type',
    ])

    estate.merge(data)

    await estate.save()

    return estate
  }

  async destroy({ params }: HttpContext) {
    const estate = await Estate.findOrFail(params.id)

    await estate.delete()
  }
}
