import { NextFunction, Request, Response } from 'express'

export default (req: Request, _res: Response, next: NextFunction) => {
  const shallowReq = {
    get: req.get,
    headers: req.headers
  }

  const getter = (key: string, defaultValue?: any) =>
    shallowReq.get(key) ??
    req.query[key] ??
    req.params[key] ??
    req.body[key] ??
    defaultValue

  req.$get = (keys, defaultValue) => {
    if (Array.isArray(keys)) {
      const result = {} as Record<string, any>

      for (const string of keys) {
        result[string] = getter(
          string,
          typeof defaultValue === 'object' ? defaultValue[string] : defaultValue
        )
      }

      return result
    }

    return getter(keys, defaultValue)
  }

  next()
}
