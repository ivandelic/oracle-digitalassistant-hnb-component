'use strict';

const express = require('express');

const port = 3001;
const url = '/demo';

const app = express();
const exchange = require('./components/property-transacton-retriever');

var input = {
    'properties': function() { return {'oib': '9876543210', 'output': 'Property list for {oib} is {propertyList}.'}},
    'reply': function(reply) { console.log(reply) },
    'transition': function(code) {console.log(code)}
}

const server = app.listen(port, () => {
    console.info(`Exchange Rate Service Endpoint: ${url} : ${port}`);
    exchange.invoke(input, function() {console.log("done!")});
});

module.exports = server;
