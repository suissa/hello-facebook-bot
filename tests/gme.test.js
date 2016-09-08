'use strict';

require('dotenv-safe').load();;

const expect = require('chai').expect;
const gme = require('../modules/services/gme');
describe('Let Me Google That For You', () => {
    let retorno;
    before((done) => {
        gme.execute({ match: ['', 'Node.JS'] }, (res) => {
            retorno = res;
            done();
        });
    });
    it('Deve retornar a URL seguida do termo de busca', () => {
        expect(retorno.text).to.equals('http://pt-br.lmgtfy.com/?q=' + encodeURIComponent('Node.JS'));
    });
});