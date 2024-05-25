import { EntityRepository, Repository } from 'typeorm'
import { User } from './entity'
import { ICreateUser, IUser } from './types'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async saveNew({ username, password }: ICreateUser): Promise<IUser> {
    return this.create({ username, password })
  }

  async findByUsername(username: string): Promise<IUser | undefined> {
    return this.findOne({ where: { username } })
  }
}
