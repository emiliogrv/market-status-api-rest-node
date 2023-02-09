import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'

export default (req: Request, _res: Response, next: NextFunction) => {
  req.$validated = (options) => matchedData(req, options)

  next()
}
