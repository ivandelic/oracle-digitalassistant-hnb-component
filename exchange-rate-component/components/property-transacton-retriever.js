"use strict"

const request = require("request");

module.exports = {
 
    metadata: () => ({
        "name": "PropertyTransactionRetriever",
        "properties": {
            "output": { "type": "string", "required": true },
            "oib": { "type": "string", "required": true }
        },
        "supportedActions": [
            "propertyFound",
            "propertyNotFound",
            "error"
        ]
    }),
 
    invoke: (conversation, done) => {
        let oib = conversation.properties()["oib"];
        let output = conversation.properties()["output"];

        console.log(`Processing request for oib "${oib}" with response "${output}".`);

        let url = `https://1DF8C89030BF4AE39AFD38679326BE69.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation`;

        request.post(
            url,
            { 
                json: {
                    channel: "test", 
                    chaincode: "realiticsai-chaincode-demo", 
                    method: "propertyQueryList",
                    chaincodeVer: "v3",
                    args: [ '' + oib + '']
                },
                auth: {
                    'user': process.env.OBP_RESTPROXY1_USERNAME,
                    'pass': process.env.OBP_RESTPROXY1_PASSWORD
                }
            },
            (err, res, body) => {
                if (err) { 
                    conversation.transition("error");
                    return done();
                }
                if (!body || body.returnCode != 'Success' || !body.result) {
                    conversation.transition("propertyNotFound");
                    return done();
                }
                let propertyList = body.result.payload;
                let answer = !!output ? output.replace("{oib}", oib).replace("{propertyList}", propertyList) : propertyList;
                conversation.reply(answer);
                conversation.transition("propertyFound");
                return done();
            }
        );
    }
};
