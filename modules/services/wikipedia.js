'use strict';

//Requires
const request = process.env.proxy ? require('request').defaults({ 'proxy': process.env.proxy }) : require('request');;
const duckduckgo = require('./duckduckgo');
const cheerioAdv = require('cheerio-advanced-selectors');
const cheerio = cheerioAdv.wrap(require('cheerio'));
//const s = require('../settings');

//Strings
const regexOnde = /Onde|ond|cadê|cade/i;
const pm = { 'parse_mode': 'Markdown' };
const ph = { 'parse_mode': 'HTML' };
const messages = {
  coordsNotFound: "*Vish, não achei as coordenadas, mas aí vai a definição: *\n",
  requestError: "Droga, deu um erro aqui em :/ ID do erro: `%mili%`",
  consoleRequestError: "Erro %mili%: %err%",
  noResultsFound: "Vish, a Wikipedia não tem nada sobre ",
  communicationError: "Putz, não tô conseguindo conversar com a Wikipedia :/ Tenta depois `%e%`"
};

// Makes HTML more compatible to https://core.telegram.org/bots/api#html-style
const simpleHTML = (code) =>
  code.split(/\s+/m).join(' ')
    .replace(/<\/?(p|h[1-6])[^>]*>/gi, '\n\n')
    .replace(/<\/?(br|div|ol|ul)[^>]*>/gi, '\n')
    .replace(/<li[^>]*>/gi, '  • ')
    .replace(/<\/li[^>]*>/gi, '\n')
    .replace(/(<(?!\/?(b|i|a|pre|code))[^>]+>)/g, '')
    .replace(/(<[^\/]>[^<]*)<[^\/]>/g, '$1')
    .replace(/<\/[^>]+>([^<]*<\/[^>]+>)/g, '$1')
    .replace(/<[^>]*$/g, '')
    .replace(/&#([0-9]+);/, (match, g1) => String.fromCharCode(g1))
    .replace(/(\n\s*){3,}/g, '\n\n')
    .replace(/^\s*|\s*$/g, '');

const escapeHTML = (code) =>
  code.replace(/&/gi, '&amp;')
    .replace(/>/gi, '&gt;')
    .replace(/</gi, '&lt;')
    .replace(/"/gi, '&quot;');

/**
 * Realiza o parse de uma response vinda do request
 */
const parseResponse = (err, res, html, args, _url, cbk) => {

  const query = args.query;

  if (!err) {
    switch (res.statusCode) {
      case 200:
        const $ = cheerio.load(html);
        //noinspection JSJQueryEfficiency,JSJQueryEfficiency,JSJQueryEfficiency
        const answers = {
          quickDef: $('#bodyContent #mw-content-text p:first').not('.coordinates').text(),
          coordinates: $('#bodyContent #mw-content-text p.coordinates').text(),
          longDef: $('#bodyContent #mw-content-text p').not('.coordinates').text().substr(0, 300)
        };

        var answer = answers.quickDef;

        answer = (answer == "") ? answers.longDef : answer;
        let _return = 'Segundo a Wikipédia: "' + answer.replace(/\[[^]]*]/, "") + '". ';

        _return = _return.split('').splice(0, 317);
        //bot.sendMessage(msg.chat.id, _return, ph);

        cbk({
          text: _return.join('') + '...', buttons: [
            {
              type: "web_url",
              url: _url,
              title: "Abrir Wikipedia"
            }
          ]
        });

        break;
      case 404:
        // bot.sendMessage(msg.chat.id, messages.noResultsFound + query);
        duckduckgo.execute(args, cbk);
        break;
    }
  } else {
    const mili = new Date().getTime();
    //bot.sendMessage(msg.chat.id, messages.requestError.replace("%mili%", mili), pm);
    cbk({ text: messages.requestError.replace("%mili%", mili) });
    console.log(messages.consoleRequestError.replace("%mili%", mili).replace("%err%", err));
  }
};

/**
 * Função principal do módulo
 *
 * @param bot Objeto bot a ser utilizado para enviar as mensagens
 * @param msg Objeto mensagem a ser utilizado para se obter  o id
 * @param args Objeto contento o tipo de pesquisa a realizar(wh) e o termo pesquisado (query)
 */
var _execute = (args, cbk) => {
  // console.log('args', args.query, args.query.toLowerCase().match(/o seu criador/i))
  if (args.query.toLowerCase() == 'o seu criador') {
    //s.get(msg.chat.id, 'stickers', (err, data) => {
    /*if (data == 'true') bot.sendSticker(msg.chat.id, 'BQADAQADGgADt-CfBCZz7J0kak9nAg', { 'reply_to_message_id': msg.message_id })
    else bot.sendMessage(msg.chat.id, 'https://github.com/Webschool-io/Bot-Telegram-BeMEAN');*/
    cbk({ text: 'https://github.com/Webschool-io/Bot-Telegram-BeMEAN' });
    //});
  }
  else {
    try {
      const _url = 'https://pt.wikipedia.org/w/index.php?title=' + args.query.toLowerCase().split(" ").join("_");
      request(_url, (err, res, html) => {
        parseResponse(err, res, html, args, _url, cbk);
      });
    }
    catch (e) {
      cbk({ text: messages.communicationError.replace("%e%", e) });
      //bot.sendMessage(msg.chat.id, messages.communicationError.replace("%e%", e), pm);
    }
  }
};

const execute = (args, cbk) => {
  if (args.match && cbk) {
    args.query = args.match[1];
    _execute(args, cbk);
  }
}

module.exports = {
  execute: execute
};