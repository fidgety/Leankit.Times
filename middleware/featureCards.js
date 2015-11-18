var _ = require('lodash');
var config = require('../config/config');
var leankit = require("leankit-client");
var client = leankit.createClient(config.accountName, config.email, config.password);
var Promise = require('bluebird');

module.exports = function storeFeatures() {
    return Promise.promisify(client.getBoardArchiveCards, {
        context: client
    })(config.boardId).then(function(archive) {
        return archive.filter(function (card) {
            return config.cardTypes.indexOf(card.TypeName) > -1;
        });
    });
};
