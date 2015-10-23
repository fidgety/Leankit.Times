var _ = require('lodash');
var moment = require('moment')

module.exports = function createCardTimer(config, client) {

    function getWeekdaysBetween(start, end) {
        var initial = moment(start);
        var weekdays = 0;
        while (initial.isBefore(end)) {
            if (initial.isoWeekday() < 5) {
                weekdays++;
            }
            initial.add(1, 'd');
        }
        return weekdays;
    }

    return function cardTimes(req, res, next) {
        var called = 0;
        var numberOfCards = 0;
        _.forEach(Object.keys(req.sizes), function (key) {
            if (key === '0') return;
            var sizes = req.sizes[key];
            numberOfCards += sizes.length;
            _.forEach(sizes, function (size, i) {
                client.getCardHistory(config.boardId, size.Id, function (err, data) {
                    if (err) {
                        console.log('err', err)
                    }
                    var firstTimeWipped = _.chain(data)
                        .where({
                            ToLaneTitle: config.fromLane
                        })
                        .map(function (x) {
                            var parsableDateTime = x.DateTime.split(' at ').join(' ')
                            return {
                                Date: moment(parsableDateTime, 'DD/MM/YYYY hh:mm:ss a')
                            }
                        })
                        .sortBy('Date')
                        .pluck('Date')
                        .value()[0];
                    if (!firstTimeWipped) {
                        return;
                    }

                    var lastTimeDone = _.chain(data)
                        .where({
                            ToLaneTitle: config.toLane
                        })
                        .map(function (x) {
                            var parsableDateTime = x.DateTime.split(' at ').join(' ')
                            return {
                                Date: moment(parsableDateTime, 'DD/MM/YYYY hh:mm:ss a')
                            }
                        })
                        .sortByOrder('Date', 'desc')
                        .pluck('Date')
                        .value()[0];

                    var started = moment(firstTimeWipped)
                    var finished = moment(lastTimeDone)

                    var totalTime = getWeekdaysBetween(started, finished);
                    size.TimeInDays = totalTime;
                });
            })
        });
        console.log(numberOfCards)
        setTimeout(function () {
            next();
        }, 60000);

    }
};