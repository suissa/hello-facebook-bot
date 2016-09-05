'use strict';

require('dotenv').config();

const Bot = require('facebook-messenger-bot').Bot;
const Elements = require('facebook-messenger-bot').Elements;

const bot = new Bot(process.env.PAGE_ACCESS_TOKEN, process.env.VERIFICATION);

bot.on('message', async (message) => {
    const {sender} = message;
    await sender.fetch('first_name');

    const out = new Elements();
    out.add({ text: `hey ${sender.first_name}, how are you!` });

    await bot.send(sender.id, out);
});

const options = {
    key: fs.readFileSync('./privkey.pem'),
    cert: fs.readFileSync('./cert.pem'),
    ca: [
        fs.readFileSync('./chain-1.pem'),
        fs.readFileSync('./chain-2.pem')
    ]
};

https.createServer(options, app).listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});