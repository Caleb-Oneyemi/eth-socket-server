import { TokenExpiredError } from 'jsonwebtoken'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

import { AuthenticationError } from '../errors'
import { validateToken } from '../utils'

export interface AppSocket extends Socket {
  user?: ReturnType<typeof validateToken>
}

export const auth = async (
  socket: AppSocket,
  next: (err?: ExtendedError) => void,
): Promise<void> => {
  let user

  try {
    const token = socket.handshake.headers.token
    if (!token || Array.isArray(token)) {
      return next(new AuthenticationError('not authenticated'))
    }

    user = validateToken(token)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new AuthenticationError('token expired'))
    }

    return next(new AuthenticationError('invalid token'))
  }

  socket.user = user

  next()
}
