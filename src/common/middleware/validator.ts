import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

import { BadRequestError } from 'routing-controllers'
import { SUBSCRIPTION_TYPES } from '../types'

export const validateSubscriptionHeaders = async (
  socket: Socket,
  next: (err?: ExtendedError) => void,
): Promise<void> => {
  const subscriptionType = socket.handshake.headers['subscription-type']
  const address = socket.handshake.headers['eth-address']

  if (!subscriptionType) {
    return next(new BadRequestError('subscription-type is required'))
  }

  const values = Object.values(SUBSCRIPTION_TYPES)
  if (
    Array.isArray(subscriptionType) ||
    !values.includes(subscriptionType as SUBSCRIPTION_TYPES)
  ) {
    return next(
      new BadRequestError(
        'invalid subscription-type. Expected all | sender_only | receiver_only | sender_or_receiver',
      ),
    )
  }

  if (
    subscriptionType !== SUBSCRIPTION_TYPES.ALL &&
    (!address || Array.isArray(address))
  ) {
    return next(
      new BadRequestError(
        'eth-address is required when subscription-type is not "all"',
      ),
    )
  }

  next()
}
