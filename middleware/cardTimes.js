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
        var featureWithSize = req.features.filter(function (card) {
            return card.Size !== 0;
        });

        var numberOfCards = featureWithSize.length;

        _.forEach(featureWithSize, function (card, i) {
            client.getCardHistory(config.boardId, card.Id, function (err, cardChanges) {
                called++;
                if (err) {
                    console.log('err', err)
                }
                var firstTimeWipped = _.chain(cardChanges)
                    .where({
                        ToLaneTitle: config.fromLane
                    })
                    .map(function (change) {
                        return {
                            Date: moment(change.DateTime, 'DD/MM/YYYY at hh:mm:ss a').format('X')
                        }
                    })
                    .sortBy('Date')
                    .pluck('Date')
                    .value()[0];

                if (!firstTimeWipped) {
                    return;
                }

                var lastTimeDone = _.chain(cardChanges)
                    .where({
                        ToLaneTitle: config.toLane
                    })
                    .map(function (change) {
                        return {
                            Date: moment(change.DateTime, 'DD/MM/YYYY at hh:mm:ss a').format('X')
                        }
                    })
                    .sortByOrder('Date', 'desc')
                    .pluck('Date')
                    .value()[0];

                var started = moment.unix(firstTimeWipped)
                var finished = moment.unix(lastTimeDone)

                var totalTime = getWeekdaysBetween(started, finished);
                card.TimeInDays = totalTime;
            });
        });
        console.log(numberOfCards)
        var interval = setInterval(function () {
            if (called === numberOfCards) {
                clearInterval(interval);
                next();
            }
            console.log('did', called, 'equal', numberOfCards);
        }, 1000);

    }
};
