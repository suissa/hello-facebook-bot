'use strict';

const expect = require('chai').expect;
const s = require('../modules/settings');
const masem = require('../modules/services/masem');

describe('Mas em', () => {
    let retornos = {};
    before((done) => {
        s.set(0, 'funny', 'false', (err, data) => {
            masem.execute({ id: 0 }, (res) => {
                retornos.turnedOff = res;
                s.set(1, 'funny', 'true', (err, data) => {
                    masem.execute({ id: 1 }, (res) => {
                        retornos.turnedOn = res;
                        done();
                    })
                })
            })
        });
    });
    it('Config desligada', () => {
        expect(retornos.turnedOff.text).to.equals('Comando não encontrado');
    });
    it('Config ligada', () => {
        expect(masem.answers.indexOf(retornos.turnedOn.text)).to.be.at.least(0);
    })
});