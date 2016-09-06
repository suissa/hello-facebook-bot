'use strict';

require('dotenv-safe').load();

const expect = require('chai').expect;
const wikipedia = require('../modules/services/wikipedia');

describe('Wikipedia', () => {
    describe('Deve retornar a URL do repo para quem é o seu criador', () => {
        let reply;
        before((done) => {
            wikipedia.execute({ match: ['', 'o seu criador'] }, (response) => {
                reply = response;
                done();
            });
        });
        it('Resposta deve ser a URL do repo', () => {
            expect(reply.text).equals('https://github.com/Webschool-io/Bot-Telegram-BeMEAN');
        });
    });
    describe('Retorno da pesquisa', () => {
        let reply;
        before(function (done) {
            this.timeout(10000);
            wikipedia.execute({ match: ['', 'Bill Gates'] }, (response) => {
                reply = response;
                done();
            })
        });
        it('Deve conter texto', () => {
            expect(reply.text).to.exist;
        });
        it('Não deve ser em branco', () => {
            expect(reply.text).to.not.equals("");
        });
        it('Tamanho máximo deve ser 320', () => {
            expect(reply.text.length).to.be.at.most(320);
        });
    });
});