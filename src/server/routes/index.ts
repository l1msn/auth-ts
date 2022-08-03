// Инициализация библиотек
import {Router} from 'express';

// Инициализация модулей
import routeValidate from './validators/routeValidate';
import userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

// Инициализируем Роутера
const router: Router = Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The api for Users
 */

/**
 * @swagger
 * tags:
 *  name: Tokens
 *  description: The api for Tokens
 */

/**
 * @swagger
 * /registration:
 *  post:
 *      summary: Endpoint for registration of new users
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      properties:
 *                          email:
 *                              description: New email
 *                              type: string
 *                          password:
 *                              description: New password
 *                              type: string
 *      responses:
 *          200:
 *              description: Info about new User in Database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          400:
 *              description: Bad request!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              message:
 *                                  description: Message about of place of error
 *                                  type: string
 *                              errors:
 *                                  description: The errors
 *                                  type: string[]
 *                          example:
 *                              message: Error on registration!
 *                              errors: ["User already exist!"]
 *          500:
 *              description: Unexpected error from server!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              message:
 *                                  description: Message about unknown error
 *                                  type: string
 *                          example:
 *                              message: Unexpected error from server!
 */

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Endpoint for login of old users
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      properties:
 *                          email:
 *                              description: User email
 *                              type: string
 *                          password:
 *                              description: User password
 *                              type: string
 *      responses:
 *          200:
 *              description: Info about old User in Database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          400:
 *              description: Bad request!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              message:
 *                                  description: Message about of place of error
 *                                  type: string
 *                              errors:
 *                                  description: The errors
 *                                  type: string[]
 *                          example:
 *                              message: Error on login!
 *                              errors: []
 *          500:
 *              description: Unexpected error from server!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              message:
 *                                  description: Message about unknown error
 *                                  type: string
 *                          example:
 *                              message: Unexpected error from server!
 */

/**
 * @swagger
 * /logout:
 *  post:
 *      summary: Endpoint for logout of users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Info about logout of Users and deleted tokens
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            acknowledged:
 *                              description: Success or fail of deleting token and logout
 *                              type: boolean
 *                            deletedCount:
 *                              description: Count of deleting token
 *                              type: number
 *                          example:
 *                              acknowledged: true
 *                              deletedCount: 1
 *          400:
 *              description: Bad request!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Message about of place of error
 *                              type: string
 *                            errors:
 *                              description: The errors
 *                              type: string[]
 *                          example:
 *                              message: Error on logout!
 *                              errors: []
 *          500:
 *              description: Unexpected error from server!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Message about unknown error
 *                              type: string
 *                          example:
 *                              message: Unexpected error from server!
 */

/**
 * @swagger
 * /activate/{link}:
 *  get:
 *      summary: Endpoint for activating user by email
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Info about activation by email
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Success or fail of activating token
 *                              type: string
 *                          example:
 *                              message: Activating success
 *          400:
 *              description: Bad request!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Message about of place of error
 *                              type: string
 *                            errors:
 *                              description: The errors
 *                              type: string[]
 *                          example:
 *                              message: Error on Activate by Link!
 *                              errors: []
 *          500:
 *              description: Unexpected error from server!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Message about unknown error
 *                              type: string
 *                          example:
 *                              message: Unexpected error from server!
 */

/**
 * @swagger
 * /refresh:
 *  get:
 *      summary: Endpoint for activating user by email
 *      tags: [Token]
 *      responses:
 *          200:
 *              description: Info about refreshing access or refresh tokens
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          400:
 *              description: Bad request!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Message about of place of error
 *                              type: string
 *                            errors:
 *                              description: The errors
 *                              type: string[]
 *                          example:
 *                              message: Error on refresh tokens!
 *                              errors: []
 *          500:
 *              description: Unexpected error from server!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                            message:
 *                              description: Message about unknown error
 *                              type: string
 *                          example:
 *                              message: Unexpected error from server!
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Endpoint for registration of new users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Info about all users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          400:
 *              description: Bad request!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              message:
 *                                  description: Message about of place of error
 *                                  type: string
 *                              errors:
 *                                  description: The errors
 *                                  type: string[]
 *                          example:
 *                              message: Error on getting users!
 *                              errors: []
 *          500:
 *              description: Unexpected error from server!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          properties:
 *                              message:
 *                                  description: Message about unknown error
 *                                  type: string
 *                          example:
 *                              message: Unexpected error from server!
 */

// Запросы Роутера
// URL, Валидация, Контроллер управления
router.post('/registration',
    routeValidate.emailValidate(),
    routeValidate.passwordValidate(),
    userController.registration);
router.post('/login',
    routeValidate.emailValidate(),
    routeValidate.passwordValidate(),
    userController.login);
router.post('/logout',
    routeValidate.tokenValidate()
    , userController.logout);
router.get('/activate/:link',
    routeValidate.linkValidate()
    , userController.activate);
router.get('/refresh',
    routeValidate.tokenValidate()
    , userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

// Экспортируем данный модуль
export default router;
