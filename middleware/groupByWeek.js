var _ = require('lodash');
var moment = require('moment')

module.exports = function create() {
    function sundayBefore(date) {
        var target = moment(date);
        target.subtract(date.day(), 'days');
        return target;
    }
    return function (req, res, next) {
        var oldestToNewest = _.sortBy(req.features, 'LastTimeDone');

        var grouped = _.groupBy(oldestToNewest, function (feature) {
            return moment(sundayBefore(feature.LastTimeDone).unix() * 1000).format("DD/MM/YY");
        })
        req.ticketsByCompletedDate = grouped;
        next();
    }
}