import 'reflect-metadata'

import { Application } from 'express'

import connect from './connect'
import expressLoader from './express'
import { Logger } from '../common'

export default async (app: Application): Promise<void> => {
  await connect()
  Logger.info('db connected...')

  expressLoader(app)
  Logger.info('server loaded...')
}
