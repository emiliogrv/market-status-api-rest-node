import { Router } from '@/tools'

import * as rules from '@/validation/rule/orderbook'

import * as controller from '@/controllers/orderbookController'

const router = Router()

router
  .get(
    '/:symbol',
    router.makeMiddlewares({
      rules: rules.show
    }),
    controller.show
  )

  .post(
    '/:symbol',
    router.makeMiddlewares({
      auth: true,
      rules: rules.create
    }),
    controller.create
  )

export default router
