import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

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
}
