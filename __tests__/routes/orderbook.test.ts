import request from 'supertest'

import { wsOrderbookServer } from '../../__mocks__/services/wsOrderbookServer'

import server from '../../src/server'

import { SYMBOLS_ALLOWED } from '../../src/config'

import { wsOrderbookClient } from '../../src/services'

describe('Orderbooks routes', () => {
  beforeEach(() => wsOrderbookServer.init())

  afterEach(() => wsOrderbookServer.close())

  test('should get empty data by symbol if there are nothing yet', async () => {
    const res = await request(server).get('/api/v1/orderbooks/ETHUSD')

    expect(res.statusCode).toBe(200)

    expect(res.body).toEqual({
      data: {
        asks: [],
        bids: []
      }
    })
  })

  test('should parse safely a valid symbol pair and slash combination', async () => {
    const res1 = await request(server).get('/api/v1/orderbooks/ethUSD')

    expect(res1.statusCode).toBe(200)

    const res2 = await request(server).get('/api/v1/orderbooks/ETH-USD')

    expect(res2.statusCode).toBe(200)

    const res3 = await request(server).get('/api/v1/orderbooks/eth-USD')

    expect(res3.statusCode).toBe(200)

    const res4 = await request(server).get('/api/v1/orderbooks/---eth-USD')

    expect(res4.statusCode).toBe(200)
  })

  test('should get all orders by symbol', async () => {
    await wsOrderbookClient.init()

    for (const symbol of SYMBOLS_ALLOWED) {
      const res = await request(server).get(`/api/v1/orderbooks/${symbol}`)

      expect(res.body).toEqual({
        data: {
          asks: [
            [1, 1, 1],
            [2, 2, 3],
            [3, 3, 6]
          ],
          bids: [
            [3, 3, 3],
            [2, 2, 5],
            [1, 1, 6]
          ]
        }
      })
    }
  })

  test('should set a sell order by symbol', async () => {
    await wsOrderbookClient.init()

    const symbol = SYMBOLS_ALLOWED[0]

    // sell
    const res = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: 4,
        type: 'sell'
      })
      .set('authorization', 'secret')

    expect(res.statusCode).toBe(201)

    expect(res.body).toEqual({
      data: {
        amount: 4,
        orders: 2,
        ordersDetails: [
          [3, 3, 9],
          [2, 1, 2]
        ],
        price: 11
      }
    })
  })

  test('should set a buy order by symbol', async () => {
    await wsOrderbookClient.init()

    const symbol = SYMBOLS_ALLOWED[0]

    // sell
    const res = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: 4,
        type: 'buy'
      })
      .set('authorization', 'secret')

    expect(res.statusCode).toBe(201)

    expect(res.body).toEqual({
      data: {
        amount: 4,
        orders: 3,
        ordersDetails: [
          [1, 1, 1],
          [2, 2, 4],
          [3, 1, 3]
        ],
        price: 8
      }
    })
  })

  test('should set a sell order with limit by symbol', async () => {
    await wsOrderbookClient.init()

    const symbol = SYMBOLS_ALLOWED[1]

    // sell
    const res = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: 4,
        limit: 3,
        type: 'sell'
      })
      .set('authorization', 'secret')

    expect(res.statusCode).toBe(201)

    expect(res.body).toEqual({
      data: {
        amount: 3,
        orders: 1,
        ordersDetails: [[3, 3, 9]],
        price: 9
      }
    })
  })

  test('should set a buy order with limit by symbol', async () => {
    await wsOrderbookClient.init()

    const symbol = SYMBOLS_ALLOWED[1]

    // sell
    const res = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: 4,
        limit: 2,
        type: 'buy'
      })
      .set('authorization', 'secret')

    expect(res.statusCode).toBe(201)

    expect(res.body).toEqual({
      data: {
        amount: 3,
        orders: 2,
        ordersDetails: [
          [1, 1, 1],
          [2, 2, 4]
        ],
        price: 5
      }
    })
  })

  test('should fail setting an order because authorization', async () => {
    await wsOrderbookClient.init()

    const symbol = SYMBOLS_ALLOWED[0]

    // without token
    const res1 = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: 1,
        type: 'buy'
      })

    expect(res1.statusCode).toBe(401)

    expect(res1.body).toEqual({
      message: 'No token provided'
    })

    // invalid token
    const res2 = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: 1,
        type: 'buy'
      })
      .set('authorization', 'invalid')

    expect(res2.statusCode).toBe(401)

    expect(res2.body).toEqual({
      message: 'Invalid token'
    })
  })

  test('should fail setting an order because bad params', async () => {
    await wsOrderbookClient.init()

    const symbol = SYMBOLS_ALLOWED[0]

    // invalid pair symbol
    const res1 = await request(server)
      .post('/api/v1/orderbooks/invalid')
      .set('authorization', 'secret')

    expect(res1.statusCode).toBe(422)

    expect(res1.body).toEqual({
      errors: [
        {
          location: 'params',
          msg: 'Invalid value',
          param: 'symbol',
          value: 'INVALID'
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'type'
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'amount',
          value: null
        }
      ]
    })

    // no data
    const res2 = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .set('authorization', 'secret')

    expect(res2.statusCode).toBe(422)

    expect(res2.body).toEqual({
      errors: [
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'type'
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'amount',
          value: null
        }
      ]
    })

    // invalid data
    const res3 = await request(server)
      .post(`/api/v1/orderbooks/${symbol}`)
      .send({
        amount: null,
        limit: null,
        type: null
      })
      .set('authorization', 'invalid')
      .set('authorization', 'secret')

    expect(res3.statusCode).toBe(422)

    expect(res3.body).toEqual({
      errors: [
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'type',
          value: null
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'amount',
          value: null
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'limit',
          value: null
        }
      ]
    })
  })
})
