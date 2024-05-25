/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status'
import { Request, NextFunction } from 'express'

import { CustomResponse } from '../types'
import { CustomError } from '../errors'
import { Logger } from '../logger'

export const errorHandler = (
  err: Error,
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): CustomResponse => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), isSuccess: false })
  }

  Logger.error(err)

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    errors: [{ message: 'something went wrong' }],
    isSuccess: false,
  })
}
