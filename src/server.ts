import cors from 'cors'
import express from 'express'

import { makeReqGet, makeReqValidated } from './tools'

import {
  globalErrorHandler,
  health,
  notFoundErrorHandler,
  orderbook
} from './routes'

const server = express()

/**
 * SERVER SETTINGS
 */
server.use(cors())
server.use(makeReqGet)
server.use(makeReqValidated)
server.use(express.urlencoded({ extended: false }))
server.use(express.json())

/**
 * SERVER ROUTES
 */
server.use('/health', health)
server.use('/api/v1/orderbooks', orderbook)
server.use(notFoundErrorHandler)
server.use(globalErrorHandler)

export default server
