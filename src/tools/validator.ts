import { NextFunction, Request, Response } from 'express'
import { ValidationError, validationResult } from 'express-validator'

type ResultType = {
  errors?: ValidationError[]
  error?: ValidationError
}

export default (req: Request, res: Response, next: NextFunction) => {
  const errorsResult = validationResult(req)
  let status = 422

  if (!errorsResult.isEmpty()) {
    const errors = errorsResult.array()
    let result: ResultType = { errors }

    for (let x = 0; x < errors.length; x++) {
      if (errors[x].msg.code) {
        status = errors[x].msg.code

        errors[x].msg = errors[x].msg.message

        result = {
          error: errors[x]
        }

        break
      }
    }

    res.status(status).json(result)
  } else {
    next()
  }
}
