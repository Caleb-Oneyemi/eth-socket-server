import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { UserRepository } from './repository'
import { ConflictError, hashPassword } from '../../common'
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
}

export default UserService
