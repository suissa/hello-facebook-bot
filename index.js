'use strict';

//Loading .env file
require('dotenv-safe').load();

//Loding dependencies
const fs = require('fs');
const https = require('https');
const Bot = require('messenger-bot');

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
    let text = payload.message.text

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) console.log(err)

        console.log(`Called for profile with ID: ${payload.sender.id}`);

        reply({ text }, (err) => {
            if (err) console.log(err)

            console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        })
    })
})


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