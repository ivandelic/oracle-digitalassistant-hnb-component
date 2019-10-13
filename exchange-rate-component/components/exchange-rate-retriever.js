"use strict"

const request = require("request");

module.exports = {
 
    metadata: () => ({
        "name": "ExchangeRateRetriever",
        "properties": {
            "output": { "type": "string", "required": true },
            "currency": { "type": "string", "required": true },
            "date": { "type": "string", "required": true },
            "type": { "type": "string", "required": true }
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
        let output = conversation.properties()["output"];

        console.log(`Processing request for type "${type}", currency "${currency}" on date "${date}" with response "${output}".`);

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

                const RoundingMode = Java.type('java.math.RoundingMode');
                const BigDecimal = Java.type('java.math.BigDecimal');
                var decimal = BigDecimal.valueOf(parseFloat(rate.replace(',', '.')));
                decimal = decimal.setScale(2, RoundingMode.HALF_EVEN);

                let answer = !!output ? output.replace("{currency}", currency).replace("{date}", date).replace("{rate}", decimal) : rate;
                conversation.reply(answer);
                conversation.transition("exchangeSuccess");
                return done();
            }
        );
    }
};
