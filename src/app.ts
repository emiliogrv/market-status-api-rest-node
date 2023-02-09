import server from './server'

import 'dotenv/config'

import { logger } from './tools'

import { wsOrderbookClient } from './services'

const PORT = Number(process.env.SERVER_PORT || process.env.PORT) || 8080
const ADDRESS = process.env.SERVER_ADDRESS || ''

server.listen(PORT, ADDRESS, () => {
  logger.info(`INFO: Server running on "${ADDRESS}" "${PORT}"`)

  wsOrderbookClient.init()
})
