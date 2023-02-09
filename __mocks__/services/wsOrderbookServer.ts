import { WebSocketServer } from 'ws'

import { wsSnapshotMessage, wsSubscribedMessage } from './wsOrderbookClient'

export const wsOrderbookServer = {
  close() {
    this.wss?.clients.forEach((ws) => ws.terminate())
    this.wss?.close()
  },
  init() {
    this.wss = new WebSocketServer({ port: 1234 })

    this.wss.on('connection', function connection(ws) {
      ws.on('message', function message(data) {
        const { symbol } = JSON.parse(data.toString())

        const id = new Date().getTime()

        ws.send(JSON.stringify(wsSubscribedMessage(symbol, id)))
        ws.send(JSON.stringify(wsSnapshotMessage(id)))
      })
    })
  },
  wss: undefined as unknown as WebSocketServer
}
