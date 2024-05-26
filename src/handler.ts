import { AppSocket, Logger } from './common'

export const connectionHandler = (client: AppSocket): void => {
  const user = client.user
  if (!user) {
    client.disconnect()
    return
  }

  Logger.info(
    `client ${user.username} connected on ${new Date().toISOString()}`,
  )

  client.on('event', (data) => {
    Logger.debug('socket data', data)
  })

  client.on('disconnect', () => {
    Logger.info(
      `client ${user.username} disconnected on ${new Date().toISOString()}`,
    )
  })
}
