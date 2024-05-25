import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ICreateUser } from './types'

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ length: 30 })
  public username: string

  @Column()
  public password: string

  @CreateDateColumn()
  public createdAt!: Date | string

  @UpdateDateColumn()
  public updatedAt!: Date | string

  constructor({ username, password }: ICreateUser) {
    super()
    this.username = username
    this.password = password
  }
}
