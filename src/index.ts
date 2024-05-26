import http from 'http'
import { Server as SocketServer } from 'socket.io'
import express, { Application } from 'express'
import config from 'config'

import loadApp from './loaders'
import { Logger, auth, validateSubscriptionHeaders } from './common'
import { connectionHandler } from './handler'

const port = config.get<number>('port')

const startServer = async () => {
  const app: Application = express()

  await loadApp(app)

  const server = http.createServer(app)

  const io = new SocketServer(server)

  io.use(auth)
  io.use(validateSubscriptionHeaders)

  io.on('connection', connectionHandler)

  server.listen(port)
}

startServer()
  .then(() => Logger.info(`server listening on port ${port}...`))
  .catch((err) => {
    Logger.warn(`failed to startup server --- ${err.message}`)
    process.exit(1)
  })

const exceptionHandler = (error: Error) => {
  Logger.error(error)

  process.exit(1)
}

process.on('uncaughtException', exceptionHandler)
process.on('unhandledRejection', exceptionHandler)
