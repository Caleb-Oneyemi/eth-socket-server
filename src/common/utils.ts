import crypto from 'crypto'
import { promisify } from 'util'
import { Response } from 'express'
import httpStatus from 'http-status'
import { ZodError } from 'zod'
import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { CustomError } from './errors'
import { Logger } from './logger'

const scrypt = promisify(crypto.scrypt)
const randomBytes = promisify(crypto.randomBytes)

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await randomBytes(16)
  const hash = (await scrypt(password, salt, 64)) as Buffer
  return Buffer.concat([salt, hash]).toString('base64')
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const buffer = Buffer.from(hashedPassword, 'base64')
  const salt = buffer.subarray(0, 16)
  const hash = buffer.subarray(16)

  const derived = (await scrypt(password, salt, 64)) as Buffer
  return derived.compare(hash) === 0
}

/** Expiry is 7 days */
export const generateToken = ({
  id,
  username,
}: {
  id: number
  username: string
}): string => {
  const secret = config.get<string>('jwtSecret')
  const token = jwt.sign({ id, username }, secret, {
    expiresIn: '7d',
  })
  return token
}

export interface AuthPayload {
  id: string
  username: string
}

export const validateToken = (token: string) => {
  const secret = config.get<string>('jwtSecret')
  const payload = jwt.verify(token, secret) as AuthPayload & JwtPayload
  return payload
}

export const formatValidationErrorMessage = (
  msg: string,
  field: string,
): string => {
  let result = msg

  if (result.startsWith('Invalid enum value')) {
    result = `invalid value for ${field}`
  }

  if (result.startsWith('String') || result.startsWith('Number')) {
    result = result.replace(/String|Number/, field)
  }

  if (result === 'Required') {
    result = `${field} is required`
  }

  return result
}

export const formatErrorResponse = (
  res: Response,
  err: unknown,
): {
  status: number
  errors: Array<{
    message: string
    field?: string | undefined
  }>
} => {
  if (err instanceof CustomError) {
    return { status: err.statusCode, errors: err.serializeErrors() }
  }

  if (err instanceof ZodError) {
    const errors = err?.issues?.map(({ message, path }) => {
      const field = (path[0] || '').toString()
      return {
        message: formatValidationErrorMessage(message, field),
        field,
      }
    })

    return { status: httpStatus.BAD_REQUEST, errors }
  }

  Logger.error(err)

  return {
    status: httpStatus.INTERNAL_SERVER_ERROR,
    errors: [{ message: 'something went wrong' }],
  }
}
