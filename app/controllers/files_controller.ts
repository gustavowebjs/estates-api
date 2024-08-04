import { HttpContext } from '@adonisjs/core/http'
import File from '#models/file'
import { inject } from '@adonisjs/core'
import UploadService from '#services/upload_service'
import { join, resolve } from 'node:path'

@inject()
export default class FilesController {
  constructor(protected upload_service: UploadService) {}

  async index({}: HttpContext) {
    const query = File.query()

    const files = await query.paginate(1, 10)

    return files
  }

  async show({ params }: HttpContext) {
    const file = await File.findOrFail(params.id)

    return file
  }

  async store({ request, response }: HttpContext) {
    const file = request.file('file')

    if (!file) {
      return response.badRequest('No file uploaded')
    }

    const uploadDir = resolve(process.cwd(), 'uploads')
    const filePath = join(uploadDir, file.clientName)

    await file.move(uploadDir, {
      name: file.clientName,
      overwrite: true,
    })

    try {
      const blobUrl = await this.upload_service.uploadFile(filePath, file.clientName)

      const data = {
        name: file.clientName,
        url: blobUrl,
        estate_id: request.input('estate_id'),
      }

      const newFile = await File.create(data)

      return newFile
    } catch (error) {
      return response.internalServerError('File upload failed')
    }
  }

  async update({ params, request }: HttpContext) {
    const file = await File.findOrFail(params.id)

    const data = request.only(['name', 'url', 'estate_id'])

    file.merge(data)

    return file
  }

  async destroy({ params }: HttpContext) {
    const file = await File.findOrFail(params.id)

    await file.delete()
    await this.upload_service.deleteFile(file.name)

    return
  }
}
