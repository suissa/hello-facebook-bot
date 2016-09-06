'use strict';

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
});