'use strict';

const expect = require('chai').expect;
const c = require('../modules/services/config');

describe('Configurações', () => {
    describe('Dados corretos', () => {
        let retornos = {};
        before((done) => {
            c.execute({ match: ['', 'clear'], id: 1 }, (result) => {
                retornos.clearAll = result;
                c.execute({ match: ['', 'search', 'clear'], id: 1 }, (result) => {
                    retornos.clearOne = result;
                    c.execute({ match: ['', 'search', 'true'], id: 1 }, (result) => {
                        retornos.setOne = result;
                        c.execute({ match: ['', 'search'], id: 1 }, (result) => {
                            retornos.getOne = result;
                            done();
                        });
                    });
                });
            });
        });
        it('Limpar todas as configurações', () => {
            expect(retornos.clearAll.text).to.equals('Configurações redefinidas');
        });
        it('Limpar uma configuração', () => {
            expect(retornos.clearOne.text).to.equals('Config `search` redefinida');
        });
        it('Definir uma configuração', () => {
            expect(retornos.setOne.text).to.equals('Config `search` definida para `true`');
        });
        it('Ler uma configuração', () => {
            expect(retornos.getOne.text).to.equals('Valor da config `search`: `true`');
        });
        after(() => {
            c.execute({ match: ['', 'clear'], id: 1 }, () => { });
        });
    });

    describe('Dados incorretos', () => {
        let retornos = {}, lista = 'Acho que você não entendeu o esquema. A sintaxe correta é: `config [nome da config] (valor|clear)`\n\nConfigs disponíveis:\n' + c.getAvailableConfigs();
        before((done) => {
            c.execute({ match: ['', 'teste', 'clear'], id: 1 }, (result) => {
                retornos.clearUnexisting = result;
                c.execute({ match: ['', 'teste', 'true'], id: 1 }, (result) => {
                    retornos.setUnexisting = result;
                    c.execute({ match: ['', 'teste'], id: 1 }, (result) => {
                        retornos.getUnexisting = result;
                        done();
                    });
                });
            });
        });
        it('Limpando config não existente', () => {
            expect(retornos.clearUnexisting.text).to.equals(lista);
        });
        it('Definindo config não existente', () => {
            expect(retornos.setUnexisting.text).to.equals(lista);
        });
        it('Lendo config não existente', () => {
            expect(retornos.getUnexisting.text).to.equals(lista);
        });
    });
});