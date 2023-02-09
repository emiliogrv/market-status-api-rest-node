import request from 'supertest'

import server from '../src/server'

describe('Test app.ts', () => {
  test('Catch-all route', async () => {
    const res = await request(server).get('/')

    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({ message: 'Unable to process your request!' })
  })
})
