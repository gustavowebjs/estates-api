import Estate from '#models/estate'
import type { HttpContext } from '@adonisjs/core/http'

export default class EstatesController {
  public async index({}: HttpContext) {
    const query = Estate.query().where('published', true)

    const estates = await query.paginate(1, 10)

    return estates
  }

  public async show({ params }: HttpContext) {
    const estate = await Estate.findOrFail(params.id)

    return estate
  }

  public async store({ request }: HttpContext) {
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

  public async update({ params, request }: HttpContext) {
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

  public async destroy({ params }: HttpContext) {
    const estate = await Estate.findOrFail(params.id)

    await estate.delete()
  }
}
