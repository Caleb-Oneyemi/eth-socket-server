import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { useExpressServer, useContainer } from 'routing-controllers'
import Container from 'typedi'
import { UserController } from '../modules/users/controller'

export default (app: Application): void => {
  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(express.json())
  app.use(
    express.urlencoded({
      extended: true,
    }),
  )

  useContainer(Container)
  useExpressServer(app, {
    routePrefix: '/api/v1',
    controllers: [UserController],
    defaultErrorHandler: false,
  })
}
