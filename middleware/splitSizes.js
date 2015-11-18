var _ = require('lodash');

module.exports = function createSizeSplitter() {

    return function splitSizes(req, res, next) {

        req.sizes = _.chain(req.features)
            .map(function (card) {
                return card;
            })
            .groupBy('Size')
            .value();

        next();

    }
};

// [{
//     Type: 'f',
//     Size: 1,
//     id: 9
// }, {
//     Type: 'f',
//     Size: 2,
//     id: 9
// }]
//
// [{
//     Size: 1,
//     id: 9
// }, {
//     Size: 2,
//     id: 9
// }]
//
// {
//     1: [{
//         Size: 1,
//         id: 9
//     }],
//     2: [{
//         Size: 2,
//         id: 9
//     }]
// }
