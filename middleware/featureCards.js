module.exports = function createFeatureParser(config, client) {
    return function storeFeatures(req, res, next) {
        client.getBoardArchiveCards(config.boardId, function (err, archive) {
            if (err) {
                return next(err)
            }

            var featureCards = [];

            var featureCards = archive.filter(function(card) {
                return config.cardTypes.indexOf(card.TypeName) > -1;
            });

            req.features = featureCards;
            next();
        });
    }
}
