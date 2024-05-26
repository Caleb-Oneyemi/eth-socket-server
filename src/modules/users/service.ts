import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { UserRepository } from './repository'
import {
  ConflictError,
  generateToken,
  hashPassword,
  verifyPassword,
} from '../../common'
import { ICreateUser, IUser } from './types'

@Service()
class UserService {
  private userRepository: UserRepository

  constructor(
    @InjectRepository(UserRepository) userRepository: UserRepository,
  ) {
    this.userRepository = userRepository
  }

  async register({ username, password }: ICreateUser): Promise<IUser> {
    const user = await this.userRepository.findByUsername(username)
    if (user) {
      throw new ConflictError('username already in use')
    }

    const hash = await hashPassword(password)

    return this.userRepository.saveNew({
      username,
      password: hash,
    })
  }

  async login({
    username,
    password,
  }: ICreateUser): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new ConflictError('invalid credentials')
    }

    const { isValid, salt } = await verifyPassword(password, user.password)
    if (!isValid) {
      throw new ConflictError('invalid credentials')
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      salt,
    })

    return { user, token }
  }
}

export default UserService
