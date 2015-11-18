var _ = require('lodash');
var leankit = require('leankit-client');
var config = require('../config/config');
var client = leankit.createClient(config.accountName, config.email, config.password);
var Promise = require('bluebird');
var getBoardArchiveCards = Promise.promisify(client.getBoardArchiveCards, {
    context: client
});

module.exports = function storeFeatures(req, res, next) {
    getBoardArchiveCards(config.boardId).then(function (archive) {
        req.features = archive.filter(function (card) {
            return config.cardTypes.indexOf(card.TypeName) > -1;
        });

        next();
    });
};
