import { IRouter, Router, RouterOptions } from 'express'

import makeMiddlewares, {
  MakeMiddlewareType,
  MiddlewareRuledType
} from './makeMiddlewares'

interface RouterCustom extends IRouter {
  makeMiddlewares: (options: MakeMiddlewareType) => MiddlewareRuledType
}

export default (options?: RouterOptions) => {
  const router = Router(options) as RouterCustom

  router.makeMiddlewares = makeMiddlewares

  return router
}
