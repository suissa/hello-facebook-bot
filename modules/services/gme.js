'use strict';

const url = require('url');

const execute = (args, cbk) => {
  const cmd = args.match[1].replace(/gme /ig, '');
  const _url = 'http://pt-br.lmgtfy.com/?q=' + encodeURIComponent(cmd);
  //bot.sendMessage(msg.chat.id, _url);
  cbk({ text: _url });
};

module.exports = {
  execute: execute
};