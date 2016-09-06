'use strict';

//Loading .env file
require('dotenv-safe').load();

//Loding dependencies
const fs = require('fs');
const https = require('https');
const Bot = require('messenger-bot');

//Carregando services
const services = require('./modules/services');

const _services = [
    {
        member: 'wikipedia',
        regex: /^(?:Quem|O que|O q|oq) (?:é|eh|eah|e|significa|são|sao) ([^?]*)\s?\??/i,
        fn: (text, cbk) => services.wikipedia.execute(text, cbk),
        eval: false
    }
]

//Seting bot up
let bot = new Bot({
    token: process.env.PAGE_ACCESS_TOKEN,
    verify: process.env.VERIFICATION,
    app_secrect: process.env.APP_SECRET
});

bot.on('error', (err) => {
    console.log(err.message)
});


bot.on('message', (payload, reply) => {
    let text = payload.message.text;
    let recognized = false;

    _services.forEach((el, index) => {
        if (_services[index].regex.test(text)) {
            let match = text.match(_services[index].regex);
            recognized = true;
            const service = _services[index];
            service.fn({ text, match }, (response) => {
                sendResponse(response, payload, reply);
            });
        }
    });

    if (!recognized) {
        services.masem.execute((response) => {
            sendResponse(response, payload, reply);
        })
    }
});

const sendResponse = (response, payload, reply) => {

    let _response;

    if (response.buttons) {
        _response = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: response.text,
                    buttons: response.buttons
                }
            }
        }
    } else if (response.text) {
        _response = { text: response.text }
    } else {
        _response = { text: 'Erro intero' }
    }

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) console.log(err)
        reply(_response, (err) => { if (err) console.log(err) })
    });
}

//Loading chain certificates
let chain = [];
JSON.parse(process.env.CHAIN_PATHS).forEach((f) => {
    chain.push(fs.readFileSync(f));
});

//Creating options object to pass to server
const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    ca: chain
};

//Starting server
https.createServer(options, bot.middleware()).listen(process.env.port || app.get('port'), function () {
    console.log('Node app is running on port', process.env.port || app.get('port'));
});