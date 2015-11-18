var _ = require('lodash');

module.exports = function createFeatureParser(config, client) {

    return function storeFeatures(req, res, next) {
        client.getBoardArchiveCards(config.boardId, function (err, archive) {
            if (err) {
                console.log(err);
                return next(err)
            }
            var data = [];
            _.forEach(config.cardTypes, function (cardType) {
                var cardsOfType = _.filter(archive, {
                    TypeName: cardType
                });
                data = data.concat(cardsOfType);
            });

            req.features = data;
            next();
        });
    }

}