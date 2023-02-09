require('dotenv').config()

require('jest-fetch-mock').enableMocks()
fetchMock.dontMock()

process.env.WS_ADDRESS = 'ws://127.0.0.1:1234'
