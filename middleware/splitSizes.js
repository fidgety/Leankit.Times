var _ = require('lodash');

module.exports = function groupCardsBySize(cards) {
    return _.chain(cards).groupBy('Size').value();
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
