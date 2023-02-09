import { NextFunction, Request, Response } from 'express'
import { ValidationChain } from 'express-validator'

import Auth from '@/middlewares/auth'

import validateRequest from './validator'

export type MakeMiddlewareType = {
  auth?: boolean
  beforeValidators?: Array<MiddlewareType>
  rules?: MiddlewareRuledType
  afterValidators?: Array<MiddlewareType>
  sanitizers?: MiddlewareRuledType
  afterSanitizers?: Array<MiddlewareType>
}

export type MiddlewareType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

export type MiddlewareRuledType = Array<ValidationChain | MiddlewareType>

export default ({
  auth = false,
  beforeValidators = [],
  rules = [],
  afterValidators = [],
  sanitizers = [],
  afterSanitizers = []
}: MakeMiddlewareType = {}): MiddlewareRuledType => [
  ...(auth ? [Auth] : []),
  ...beforeValidators,
  ...rules.concat(rules.length ? validateRequest : []),
  ...afterValidators,
  ...sanitizers,
  ...afterSanitizers
]
