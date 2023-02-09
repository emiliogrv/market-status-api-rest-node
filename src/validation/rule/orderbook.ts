import { body, param } from 'express-validator'

import { SYMBOLS_ALLOWED } from '@/config'

function removeDash(symbol: string) {
  return symbol.replace(/-/g, '')
}

export const show = [
  param('symbol')
    .isString()
    .bail()
    .customSanitizer(removeDash)
    .toUpperCase()
    .isIn(SYMBOLS_ALLOWED)
]

export const create = [
  param('symbol')
    .isString()
    .bail()
    .customSanitizer(removeDash)
    .toUpperCase()
    .isIn(SYMBOLS_ALLOWED),
  body('type').isString().bail().toLowerCase().isIn(['buy', 'sell']),
  body('amount').toFloat().isFloat({ min: 0.0001 }),
  body('limit').optional().toFloat().isFloat({ min: 0.0001 })
]
