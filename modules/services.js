'use strict';

const wikipedia = require('./services/wikipedia');
const masem = require('./services/masem');
const gmaps = require('./services/gmaps');
const saudacao = require('./services/saudacao');
const gme = require('./services/gme');
const omdb = require('./services/omdb');
const config = require('./services/config');

module.exports = {
    wikipedia,
    masem,
    gmaps,
    saudacao,
    gme,
    omdb,
    config
}