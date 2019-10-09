'use strict';

const express = require('express');

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const serviceUrl = '/components';

const app = express();
const main = require('./service');

main(app, serviceUrl);

const server = app.listen(port, () => {
  console.info(`Exchange Rate Service Endpoint: ${serviceUrl} : ${port}`);
});

module.exports = server;
