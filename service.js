const path = require("path");
const OracleBot = require("@oracle/bots-node-sdk");

/**
 * Set up custom component service
 * @param {object} app - express app or router
 * @param {string} urlPath - url path prefix for custom component service
 * @param {object} config - additional config parameters
 */
module.exports = (app, urlPath, config) => {
    // load custom component package in ./custom directory
    const ccPath = path.resolve('./exchange-rate-component');
    console.log(ccPath);
    const ccPkg = require(ccPath);

    // initialize the runtime with OracleBot
    OracleBot.init(app, {
        logger: console
    });
    OracleBot.Middleware.customComponent(app, {
        baseUrl: urlPath,
        cwd: ccPkg.cwd || ccPath,
        register: ccPkg.components
    });

    console.info('Component service created at context path=' + urlPath);
};