'use strict';

//Loading .env file
require('dotenv-safe').load();

//Loding dependencies
const fs = require('fs');
const https = require('https');
const Bot = require('messenger-bot');
const locationutils = require('./modules/utils/locationutils');
//Carregando services
const services = require('./modules/services');

const _services = [
    {
        member: 'wikipedia',
        regex: /^(?:Quem|O que|O q|oq) (?:é|eh|eah|e|significa|são|sao) ([^?]*)\s?\??/i,
        fn: (args, cbk) => services.wikipedia.execute(args, cbk),
        eval: false
    },
    {
        member: 'gmaps',
        regex: /onde\s+(?:fica|está|é|eh)\s*(?:o|a)?\s+([^?]+)\??$/i,
        fn: (args, cbk) => services.gmaps.execute(args, cbk),
        eval: false
    },
    {
        member: 'saudacao',
        regex: /b(oa|om) (dia|tarde|noite)/i,
        fn: (bot, msg, match) => services.saudacao.execute(bot, msg, match),
        eval: false
    },
    {
        member: 'lmgtfy',
        regex: /^gme\s+([a-zA-Z ]+)+/i,
        fn: (bot, msg, match) => services.gme.execute(bot, msg, match),
        eval: false
    },
    {
        member: 'omdb',
        regex: /bot, (?:v?o?c?[e|ê]?)? *(?:j[a|á])? *(?:viu|assist[iu|e]|gost[a|ou]|conhece) *(?:de )? *([^?]+)/i,
        fn: (bot, msg, match) => services.omdb.execute(bot, msg, match),
        eval: false
    },
    {
        member: 'config',
        regex: /config +([^ ]+) *([^ ]+)*/i,
        fn: (bot, msg, match) => services.config.execute(bot, msg, match),
        eval: false
    }
]

//Seting bot up
let fbBot = new Bot({
    token: process.env.PAGE_ACCESS_TOKEN,
    verify: process.env.VERIFICATION,
    app_secrect: process.env.APP_SECRET
});

fbBot.on('error', (err) => {
    console.log(err.message)
});


fbBot.on('message', (payload, reply) => {
    let text = payload.message.text;
    let recognized = false;

    _services.forEach((el, index) => {
        if (_services[index].regex.test(text)) {
            let match = text.match(_services[index].regex);
            let id = payload.sender.id;
            recognized = true;
            const service = _services[index];
            service.fn({ text, match, id }, (response) => {
                sendResponse(response, payload, reply);
            });
        }
    });

    if (!recognized) {
        services.masem.execute({ id: payload.sender.id }, (response) => {
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
    } else if (response.location) {
        _response = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: response.location.name,
                            item_url: locationutils.mapsBaseUrl + `${response.location.lat},${response.location.lng}`,
                            image_url: locationutils.getStaticMap(response.location.name, response.location.lat, response.location.lng),
                            subtitle: 'Abrir no Google Maps'
                        }
                    ]
                }
            }
        }
    } else if (response.movie) {
        _response = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: response.movie.text,
                            item_url: response.movie.link,
                            image_url: response.movie.poster,
                            subtitle: response.movie.plot,
                            buttons: response.buttons
                        }
                    ]
                }
            }
        }
    } else {
        _response = { text: 'Erro intero' }
    }

    fbBot.getProfile(payload.sender.id, (err, profile) => {
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
https.createServer(options, fbBot.middleware()).listen(process.env.port || app.get('port'), function () {
    console.log('Node app is running on port', process.env.port || app.get('port'));
});