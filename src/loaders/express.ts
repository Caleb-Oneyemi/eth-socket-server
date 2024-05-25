import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { errorHandler, NotFoundError } from '../common'

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

  app.all('*', (req, res, next) => {
    next(new NotFoundError('route not found'))
  })

  app.use(errorHandler)
}
