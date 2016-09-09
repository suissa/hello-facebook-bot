'use strict';

if (process.env.environment && process.env.environment != 'CI') require('dotenv-safe').load();

const expect = require('chai').expect;
const saudacao = require('../modules/services/saudacao');

describe('Saudacao', () => {
    describe('Horário correto', () => {
        let retornos = {};
        let date = new Date();
        date.setUTCMinutes(0);

        date.setUTCHours(14);

        before((done) => {
            saudacao.execute({ match: ['', 'om', 'dia'] }, (response) => {
                retornos.bomDia = response;
                date.setUTCHours(17);
                saudacao.execute({ match: ['', 'oa', 'tarde'] }, (response) => {
                    retornos.boaTarde = response;
                    date.setUTCHours(22)
                    saudacao.execute({ match: ['', 'oa', 'noite'] }, (response) => {
                        retornos.boaNoite = response;
                        done();
                    }, date);
                }, date);
            }, date);
        });
        it('Bom dia', () => {
            expect(retornos.bomDia.text).to.equals('Opa, bom dia, jovem!');
        });
        it('Boa tarde', () => {
            expect(retornos.boaTarde.text).to.equals('Opa, boa tarde, jovem!');
        });
        it('Boa noite', () => {
            expect(retornos.boaNoite.text).to.equals('Opa, boa noite, jovem!');
        });
    });
    describe('Horário incorreto', () => {
        let retornos = {};
        let dates = {
            dia: new Date('01/01/2016 16:00'),
            tarde: new Date('01/01/2016 21:00'),
            noite: new Date('01/01/2016 18:00')
        }
        before((done) => {
            saudacao.execute({ match: ['', 'om', 'dia'] }, (response) => {
                retornos.bomDia = response;
                saudacao.execute({ match: ['', 'oa', 'tarde'] }, (response) => {
                    retornos.boaTarde = response;
                    saudacao.execute({ match: ['', 'oa', 'noite'] }, (response) => {
                        retornos.boaNoite = response;
                        done();
                    }, dates.noite);
                }, dates.tarde);
            }, dates.dia);
        });
        it('Bom dia', () => {
            expect(retornos.bomDia.text).to.equals(`Bom dia, jovem? Agora são ${dates.dia.getUTCHours() - 3}h00! Você devia regular seus horários!`);
        });
        it('Boa tarde', () => {
            expect(retornos.boaTarde.text).to.equals(`Boa tarde, jovem? Agora são ${dates.tarde.getUTCHours() - 3}h00! Você devia regular seus horários!`);
        });
        it('Boa noite', () => {
            expect(retornos.boaNoite.text).to.equals(`Boa noite, jovem? Agora são ${dates.noite.getUTCHours() - 3}h00! Você devia regular seus horários!`);
        });
    });
});