# Market Status API REST with Node.js
The goal of this project is to create a public API REST that retrieves market information for trading pairs.

## Specifications
1. Use Express framework to set up the server.
2. The API should expose two endpoints:
   1. One that receives a pair name, and retrieves the tips of the
   orderbook (i.e. the better prices for bid-ask). Response should
   include both the total amounts and prices.
   2. Other endpoint that is called with the pair name, the operation
   type (buy/sell) and the amount to be traded. Returns the
   effective price that will result if the order is executed (i.e.
   evaluate Market Depth).
3. Use auth header when calling operation type endpoint.
4. API should return market values for the following pairs: BTC-USD and
   ETH-USD. It handles unexpected pairs.
5. In the second endpoint, include a parameter to set a limit for the
effective price and retrieves the maximum order size that could be
executed.
6. Create a set of unit tests for the logic used in the Market Depth
implementation.
7. Use websockets, without persistent storage. It should also support a HTTP interface to fetch the
endpoints.
