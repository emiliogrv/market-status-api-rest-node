import { SymbolsAllowedEnum } from '../../src/config'

export const wsSubscribedMessage = (
  pair: SymbolsAllowedEnum,
  chanId: number
) => ({
  chanId,
  channel: 'book',
  event: 'subscribed',
  freq: 'F0',
  len: '25',
  pair,
  prec: 'P0',
  symbol: `t${pair}`
})

export const wsSnapshotMessage = (chanId: number) => [
  chanId,
  [
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3],
    [1, 1, -1],
    [2, 2, -2],
    [3, 3, -3]
  ]
]
