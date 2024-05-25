export interface IUser {
  id: number
  username: string
  password: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type ICreateUser = Pick<IUser, 'username' | 'password'>
