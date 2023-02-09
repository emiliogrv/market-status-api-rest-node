import { SymbolsAllowedEnum } from '@/config'

// this could be a redis or any other source storage
const dataStorage = new Map()

// entities can be classes or objects, it depends on team's agreements
async function fill(
  symbol: SymbolsAllowedEnum,
  [price, count, amount]: Array<number>
) {
  const type = amount > 0 ? 'bids' : 'asks'
  const key = `${symbol}_${type}`
  const symbolData = dataStorage.get(key) || new Map()

  if (count === 0) {
    symbolData.delete(price)
  } else {
    amount = Math.abs(amount)
    symbolData.set(price, [price, amount, amount])
  }

  if (symbolData.size > 1) {
    const values = Array.from<Array<number>>(symbolData.values())

    symbolData.clear()

    values.sort((a, b) =>
      // sorting bids DESC & asks ASC order
      type === 'asks' ? a[0] - b[0] : b[0] - a[0]
    )

    dataStorage.set(
      key,
      new Map(
        values.reduce((prev, [_price, _amount], index) => {
          const total = index
            ? parseFloat(
                // calculating totals from amounts
                (_amount + prev[index - 1][1][2]).toFixed(8)
              )
            : _amount

          prev.push([_price, [_price, _amount, total]])

          return prev
        }, [] as any) as Iterable<readonly [unknown, unknown]>
      )
    )
  } else {
    dataStorage.set(key, symbolData)
  }
}

async function all(symbol: SymbolsAllowedEnum, asMap = false) {
  if (asMap) {
    return new Map([
      ['asks', dataStorage.get(`${symbol}_asks`) || new Map()],
      ['bids', dataStorage.get(`${symbol}_bids`) || new Map()]
    ])
  }

  return {
    asks: await allArrayOf(symbol, 'asks'),
    bids: await allArrayOf(symbol, 'bids')
  }
}

async function allArrayOf(
  symbol: SymbolsAllowedEnum,
  type: 'asks' | 'bids'
): Promise<Array<Array<number>>> {
  return Array.from(dataStorage.get(`${symbol}_${type}`)?.values() || [])
}

async function makeOrderOf({
  symbol,
  type,
  amount,
  limit
}: {
  symbol: SymbolsAllowedEnum
  type: 'buy' | 'sell'
  amount: number
  limit?: number
}) {
  const result: {
    amount: number
    orders: number
    ordersDetails: Array<Array<number>>
    price: number
  } = {
    amount: 0,
    orders: 0,
    ordersDetails: [],
    price: 0
  }

  const orders = await allArrayOf(symbol, type === 'sell' ? 'bids' : 'asks')

  const selectedOrders = []

  for (const order of orders) {
    if (limit && type === 'sell' && order[0] < limit) {
      break
    } else if (limit && type === 'buy' && order[0] > limit) {
      break
    }

    selectedOrders.unshift(order)

    if (order[2] >= amount) {
      break
    }
  }

  for (let i = 0; i < selectedOrders.length; i++) {
    const [_price, _amount, _total] = selectedOrders[i]
    let amountResult = _amount

    if (!i && _total > amount) {
      const diff = parseFloat((_total - _amount).toFixed(8))

      amountResult = parseFloat((amount - diff).toFixed(8))
    }

    const subtotal = parseFloat((_price * amountResult).toFixed(8))

    result.ordersDetails.unshift([_price, amountResult, subtotal])
    result.price = parseFloat((result.price + subtotal).toFixed(8))
    result.amount = parseFloat((result.amount + amountResult).toFixed(8))
  }

  result.orders = selectedOrders.length

  return result
}

export { all, allArrayOf, fill, makeOrderOf }
