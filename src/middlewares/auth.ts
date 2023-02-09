import { NextFunction, Request, Response } from 'express'

export default async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // any auth validation can be done here, like JWT, hashmap, etc
    const token = req.headers['authorization']

    if (!token) {
      return next({
        message: 'No token provided',
        status: 401
      })
    }

    if (process.env.API_AUTH_KEY !== token) {
      return next({
        message: 'Invalid token',
        status: 401
      })
    }

    next()
  } catch (err) {
    next(err)
  }
}
