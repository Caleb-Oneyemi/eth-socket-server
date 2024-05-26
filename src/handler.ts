import { AppSocket, Logger, SUBSCRIPTION_TYPES, getRoom } from './common'

export const connectionHandler = (client: AppSocket): void => {
  const user = client.user
  if (!user) {
    client.disconnect()
    return
  }

  const address = client.handshake.headers['eth-address'] as string
  const subscriptionType = client.handshake.headers[
    'subscription-type'
  ] as string

  Logger.debug(
    `client ${user.username} connected on ${new Date().toISOString()}. subscribing to ${subscriptionType} events ${subscriptionType !== SUBSCRIPTION_TYPES.ALL ? `for eth address ${address}` : ''}`,
  )

  const room = getRoom(subscriptionType, address)

  Logger.debug(`client ${user.username} joining room ${room}`)

  client.join(room)

  client.on('disconnect', () => {
    Logger.debug(
      `client ${user.username} disconnected on ${new Date().toISOString()}. leaving room ${room}`,
    )
    client.leave(room)
  })
}
