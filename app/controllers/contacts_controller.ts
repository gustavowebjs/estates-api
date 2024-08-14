import type { HttpContext } from '@adonisjs/core/http'

import Contact from '#models/contact'

export default class ContactsController {
  async store({ request }: HttpContext) {
    const data = request.only(['name', 'email', 'phone', 'address', 'city', 'state', 'zip'])

    const contact = await Contact.create(data)

    return contact
  }

  async index({ request }: HttpContext) {
    const { name, page = 1, pageSize = 25 } = request.qs()

    const query = Contact.query().orderBy('name', 'asc')

    if (name) {
      query.where('name', 'like', `%${name}%`)
    }

    const contacts = await query.paginate(page, pageSize)

    return contacts
  }

  async show({ params }: HttpContext) {
    const contact = await Contact.findOrFail(params.id)

    return contact
  }

  async update({ request, params }: HttpContext) {
    const contact = await Contact.findOrFail(params.id)

    const data = request.only(['name', 'email', 'phone', 'address', 'city', 'state', 'zip'])

    contact.merge(data)

    await contact.save()

    return contact
  }

  async destroy({ params }: HttpContext) {
    const contact = await Contact.findOrFail(params.id)

    await contact.delete()
  }
}
