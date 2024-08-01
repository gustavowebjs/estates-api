const EstatesController = () => import('#controllers/estates_controller')
const TenantsController = () => import('#controllers/tenants_controller')
const UsersController = () => import('#controllers/users_controller')
const SessionController = () => import('#controllers/session_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('users', UsersController).apiOnly()
router.resource('tenants', TenantsController).apiOnly()
router.resource('estates', EstatesController).apiOnly()

router.post('/login', [SessionController, 'login'])
router.post('/register', [SessionController, 'register'])

router.get('/session', [SessionController, 'session']).use(middleware.auth())
