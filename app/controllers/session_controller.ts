import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      token: token.value!.release(),
    }
  }

  async register({ request, response }: HttpContext) {
    const { email, password, name } = request.only(['email', 'password', 'name'])

    const user = await User.create({
      email,
      password,
      name,
    })

    return response.status(201).json(user)
  }

  async session({ auth, response }: HttpContext) {
    return response.json(auth.user)
  }
}
