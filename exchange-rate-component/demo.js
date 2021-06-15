'use strict';

const express = require('express');

const port = 3000;
const url = '/demo';

const app = express();
const exchange = require('./components/exchange-rate-retriever');

var input = {
    'properties': function() { return {'currency': 'CZK', 'date': '2021-06-14', 'type': 'Middle', 'amount': '1000', 'output': 'Exchange rate for {currency} on day {date} is {rate}. Conversion amount {amount} {currency} is {conversion} HRK'}},
    'reply': function(reply) { console.log(reply) },
    'transition': function() {}
}

const server = app.listen(port, () => {
    console.info(`Exchange Rate Service Endpoint: ${url} : ${port}`);
    exchange.invoke(input, function() {});
    server.close();
});

module.exports = server;
