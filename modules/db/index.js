'use strict';

const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/bemean';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

mongoose.connection.on('  ', function () {
    if (process.env.debug_level >= 1) console.log('Mongoose default connection open to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    if (process.env.debug >= 0) console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    if (process.env.debug >= 1) console.log('Mongoose default connection disconnected');
});
mongoose.connection.on('open', function () {
    if (process.env.debug >= 1) console.log('Mongoose default connection is open');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        if (process.env.debug_level >= 1) console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = {
    setting: require('./setting'),
    user: require('./user')
};