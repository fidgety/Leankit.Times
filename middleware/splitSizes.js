var _ = require('lodash');

module.exports = function createSizeSplitter() {

    return function splitSizes(req, res, next) {

        req.sizes = _.chain(req.features)
            .map(function (card) {
                return {
                    Size: card.Size,
                    Id: card.Id
                };
            })
            .groupBy('Size')
            .value();

        next();

    }
};