'use strict';

const request = require('request');
const API_URLS = {
  exact: "http://www.omdbapi.com/?plot=short&r=json&t=",
  search: "http://www.omdbapi.com/?plot=short&r=json&s=",
  with_id: "http://www.omdbapi.com/?plot=short&r=json&i="
};

const MESSAGES = {
  search_succes_nf: "Hm... Esse nome me lembra mais de um título. Clique no botão do título desejado para mais informações.",
  search_succes_f: "Escolha um título para obter os detalhes",
  search_fail_nf: "Vish, esse aí eu não conheço, não :/"
};

const IMDB_URL = 'http://www.imdb.com/title/';

const s = require('../settings');

const execute = (args, cbk) => {
  s.get(args.id, 'search', (err, data) => {
    if (data == 'true') _execute(args, cbk);
  })
}

const _execute = (args, cbk) => {
  //noinspection JSUnusedAssignment
  let forceSearch = args.forceSearch || false;
  if (args.match[1] && args.match[1] != " " && args.match[1] != "") {
    _findInfo(args.match[1], forceSearch, args.id, cbk);
  } else {
    cbk({ text: "Como vou saber, se vc não me fala o nome, jovem?" });
  }
};

const _findInfo = (title, forceSearch, id, cbk) => {
  forceSearch = forceSearch || false;
  const _runSearch = (title, force, cbk) => {
    request(API_URLS.search + encodeURIComponent(title), (err, res, content) => {
      if (!err) {
        let _info = JSON.parse(content);
        if (_info.Response != 'False') {
          let _return = {
            count: _info.totalResults,
            results: []
          };
          _info.Search.forEach((result) => {
            _return.results.push([{ text: result.Title, callback_data: { movie_id: result.imdbID } }]);
          });
          _respond(_return, force, cbk);
        } else {
          _respond(false, cbk);
        }
      } else {
        console.log("Erro: " + err);
        _respond(false, cbk);
      }
    });
  };

  if (!forceSearch) {
    request(id ? API_URLS.with_id + id : API_URLS.exact + encodeURIComponent(title), (err, res, content) => {
      if (!err) {
        let _info = JSON.parse(content);
        /**
         * @param _info
         * @param _info.totalResults
         * @param _info.Search
         * @param _info.Response
         * @param _info.Title
         * @param _info.Genre
         * @param _info.Type
         * @param _info.Released
         * @param _info.Plot
         * @param _info.Poster
         * @param _info.imdbID
         */
        if (_info.Response != 'False') {
          let _return = {
            count: 1,
            poster: _info.Poster,
            text: _info.Title + "\n\n" + "Gênero: " + _info.Genre + "\n" + "Tipo: " + _info.Type + "\n" + "Lançado em " + _info.Released + "\n" + "Sinopse: " + _info.Plot + "\n" + "Poster: " + _info.Poster,
            imdb_link: IMDB_URL + _info.imdbID
          };
          _respond(_return, args.forceSearch, cbk);
        } else {
          _runSearch(title, false, cbk);
        }
      } else {
        console.log("Erro: " + err);
        _respond(false, cbk);
      }
    });
  } else {
    _runSearch(title, true, cbk);
  }
};

const _respond = (info, force, cbk) => {
  force = force || false;
  if (info) {
    if (info.count == 1) {
      if (!force) cbk({ text: "Opa, esse eu conheço!" });
      setTimeout(() => {
        cbk({ text: info.text, buttons: [{ type: 'web_url', url: info.imdb_link, title: 'Mais informações' }] });
      }, 1000);
    } else {
      cbk({ text: force ? MESSAGES.search_succes_f : MESSAGES.search_succes_nf });
    }
  } else {
    cbk({ text: MESSAGES.search_fail_nf });
  }
};

module.exports = {
  execute,
  _findInfo
};