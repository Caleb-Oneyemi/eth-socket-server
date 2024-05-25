import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ICreateUser } from './types'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ unique: true, length: 30 })
  public username: string

  @Column()
  public password: string

  @CreateDateColumn()
  public createdAt!: Date | string

  @UpdateDateColumn()
  public updatedAt!: Date | string

  constructor(data: ICreateUser) {
    super()
    this.username = data?.username
    this.password = data?.password
  }
}
