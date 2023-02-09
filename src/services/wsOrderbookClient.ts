import * as process from 'process'
import WS from 'ws'

import { SYMBOLS_ALLOWED } from '@/config'

import { logger } from '@/tools'

import { orderbook } from '@/entities'

const symbolsIndex = new Map()

function listen(ws: WS) {
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message.toString())

    if (parsedMessage.event === 'subscribed') {
      logger.info(`INFO: WS Book subscribed to ${parsedMessage.pair}`)

      symbolsIndex.set(parsedMessage.chanId, parsedMessage.pair)

      return
    }

    // avoid invalid data
    if (!(Array.isArray(parsedMessage) && Array.isArray(parsedMessage[1]))) {
      return
    }

    const symbol = symbolsIndex.get(parsedMessage[0])

    // if the data is the snapshot
    if (parsedMessage[1].length > 3) {
      for (let index = 0; index < parsedMessage[1].length; index++) {
        await orderbook.fill(symbol, parsedMessage[1][index])
      }

      symbolsIndex.get(symbol)()
      symbolsIndex.delete(symbol)

      return
    }

    // realtime updates
    await orderbook.fill(symbol, parsedMessage[1])
  })
}

function init(): Promise<void> {
  return new Promise((resolve) => {
    const ws = new WS(process.env.WS_ADDRESS || '')
    const opened: Array<Promise<void>> = []

    listen(ws)

    // TODO: handle disconnection; ping & pong
    ws.on('open', async () => {
      for (const symbol of SYMBOLS_ALLOWED) {
        ws.send(
          JSON.stringify({
            channel: 'book',
            event: 'subscribe',
            symbol
          })
        )

        opened.push(
          new Promise((_resolve) => {
            symbolsIndex.set(symbol, _resolve)
          })
        )
      }

      await Promise.all(opened)

      resolve()
    })
  })
}

export { init }
