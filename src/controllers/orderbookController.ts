import { NextFunction, Request, Response } from 'express'

import { orderbook } from '@/entities'

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await orderbook.all(req.$get('symbol'))

    res.send({ data })
  } catch (error) {
    next(error)
  }
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, limit, symbol, type } = req.$validated()

  const data = await orderbook.makeOrderOf({
    amount,
    limit,
    symbol,
    type
  })

  try {
    res.status(201).send({ data })
  } catch (error) {
    next(error)
  }
}
