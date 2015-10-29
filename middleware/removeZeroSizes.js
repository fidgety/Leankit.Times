var _ = require('lodash');
var moment = require('moment')

module.exports = function create() {
    function sundayBefore(date) {
        var target = moment(date);
        target.subtract(date.day(), 'days');
        return target;
    }
    return function (req, res, next) {
        req.features = _.filter(req.features, function (feature) {
            return feature.Size > 0
        });
        next();
    }
}