var _ = require('lodash');
var moment = require('moment')

module.exports = function create() {
    function sundayBefore(date) {
        var target = moment(date);
        target.subtract(date.day(), 'days');
        return target;
    }
    return function (req, res, next) {
        req.averageSizes = [];

        _.map(req.ticketsByCompletedDate, function (tickets, groupId) {
            console.log(groupId)
            var total = _.sum(tickets, 'Size');
            req.averageSizes.push({
                key: groupId,
                average: Math.round(total / tickets.length),
                numberOfCards: tickets.length,
                total: total
            });
        })
        console.log(req.averageSizes)
        next();
    }
}