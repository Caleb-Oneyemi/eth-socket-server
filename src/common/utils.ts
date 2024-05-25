import crypto from 'crypto'
import { promisify } from 'util'

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
