"use strict"

const request = require("request");

module.exports = {
 
    metadata: () => ({
        "name": "ExchangeRateRetriever",
        "properties": {
            "output": { "type": "string", "required": true },
            "currency": { "type": "string", "required": true },
            "date": { "type": "string", "required": true },
            "type": { "type": "string", "required": true },
            "amount": { "type": "string", "required": false }
        },
        "supportedActions": [
            "exchangeSuccess",
            "exchangeNotFound",
            "error"
        ]
    }),
 
    invoke: (conversation, done) => {
        let currency = conversation.properties()["currency"];
        let date = conversation.properties()["date"];
        let type = conversation.properties()["type"];
        let amount = conversation.properties()["amount"];
        let output = conversation.properties()["output"];

        console.log(`Processing conversion for type "${type}", currency "${currency}", amount "${amount}", on date "${date}" with response "${output}".`);

        let conversionTypes = { 
            "Buying": "Kupovni za devize",
            "Middle": "Srednji za devize",
            "Selling": "Prodajni za devize"
        };

        try {
            date = new Date(date).toISOString().substring(0,10);
        } 
        catch (error) {
            conversation.transition("error");
            return done();
        }

        let url = `http://api.hnb.hr/tecajn/v1?valuta=${currency}&datum=${date}`;

        request.get(url, { json: true },
            (err, res, body) => {
                if (err) { 
                    conversation.transition("error");
                    return done();
                }
                if (!body || !body[0] || !conversionTypes[type] || !body[0][conversionTypes[type]]) {
                    conversation.transition("exchangeNotFound");
                    return done();
                }

                let rate = body[0][conversionTypes[type]];
                let conversion = 0;

		        if (typeof Java !== 'undefined' && !!amount) {
		            console.log('Using GraalVM Node.js implementation to round result with java.math.BigDecimal.');
                    const RoundingMode = Java.type('java.math.RoundingMode');
                    const BigDecimal = Java.type('java.math.BigDecimal');
                    var rateBd = BigDecimal.valueOf(parseFloat(rate.replace(',', '.')));
                    var amountBd = BigDecimal.valueOf(parseFloat(amount.replace(',', '.')));
                    conversion = rateBd.multiply(amountBd).setScale(2, RoundingMode.HALF_EVEN);
		        }

                let answer = !!output ? output.replace(/{currency}/g, currency).replace(/{date}/g, date).replace(/{rate}/g, rate).replace(/{conversion}/g, conversion).replace(/{amount}/g, amount) : rate;
                conversation.reply(answer);
                conversation.transition("exchangeSuccess");
                return done();
            }
        );
    }
};
