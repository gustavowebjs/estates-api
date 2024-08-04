const EstatesController = () => import('#controllers/estates_controller')
const TenantsController = () => import('#controllers/tenants_controller')
const UsersController = () => import('#controllers/users_controller')
const SessionController = () => import('#controllers/session_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const FilesController = () => import('#controllers/files_controller')

router.get('/', async () => {
  return {
    apiStatus: 'ok',
  }
})

// Authenticated routes
router
  .group(() => {
    router.get('/session', [SessionController, 'session'])
    router.resource('users', UsersController).apiOnly()
    router.resource('tenants', TenantsController).apiOnly()
    router.resource('estates', EstatesController).apiOnly()
    router.resource('files', FilesController).apiOnly()
  })
  .use(middleware.auth())

// Public routes
router.post('/login', [SessionController, 'login'])
router.post('/register', [SessionController, 'register'])
