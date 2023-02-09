import request from 'supertest'

import server from '../../src/server'

describe('health route', () => {
  test('should return a 204 status code', async () => {
    const res = await request(server).get('/health')

    expect(res.statusCode).toEqual(204)
  })
})
