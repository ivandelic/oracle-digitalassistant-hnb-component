'use strict';

const express = require('express');

const port = 3000;
const url = '/demo';

const app = express();
const exchange = require('./components/exchange-rate-retriever');

var input = {
    'properties': function() { return {'currency': 'EUR', 'date': '2019-10-10', 'type': 'Middle', 'output': 'Exchange rate for {currency} on day {date} is {rate}.'}},
    'reply': function(reply) { console.log(reply) },
    'transition': function() {}
}

const server = app.listen(port, () => {
    console.info(`Exchange Rate Service Endpoint: ${url} : ${port}`);
    exchange.invoke(input, function() {});
});

module.exports = server;
