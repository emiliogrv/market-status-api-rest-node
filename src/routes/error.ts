import { NextFunction, Request, Response } from 'express'

import { logger } from '@/tools'

interface ErrorResponse {
  status?: number
  message?: string
}

export const notFoundErrorHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Unable to process your request!'
  })
}

export const globalErrorHandler = (
  err: ErrorResponse,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(err)

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong'
  })
}
