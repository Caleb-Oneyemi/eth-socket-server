import { Body, Post, JsonController, Res } from 'routing-controllers'
import { ICreateUser } from './types'
import { Response } from 'express'
import UserService from './service'
import httpStatus from 'http-status'
import { formatErrorResponse } from '../../common'
import { registerSchema } from './schema'
import { Service } from 'typedi'

@JsonController()
@Service()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/users')
  async create(@Body() user: ICreateUser, @Res() res: Response): Promise<void> {
    try {
      await registerSchema.parseAsync(user)
      const data = await this.userService.register(user)
      res.status(httpStatus.CREATED).send({
        isSuccess: true,
        data,
      })
    } catch (err) {
      const { status, errors } = formatErrorResponse(res, err)

      res.status(status).send({ errors, isSuccess: false })
    }
  }
}
