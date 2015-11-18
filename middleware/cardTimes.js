var _ = require('lodash');
var moment = require('moment');
var momentBusiness = require('moment-business');

var config = require('../config/config');
var leankit = require("leankit-client");
var client = leankit.createClient(config.accountName, config.email, config.password);
var dateFormat = 'DD/MM/YYYY at hh:mm:ss a';

module.exports = function cardTimes(req, res, next) {
    var called = 0;
    var featureWithSize = req.features.filter(function (card) {
        return card.Size !== 0;
    });

    var numberOfCards = featureWithSize.length;

    _.forEach(featureWithSize, function (card, i) {
        client.getCardHistory(config.boardId, card.Id, function (err, cardHistory) {
            called++;
            if (err) {
                console.log('err', err)
            }

            var cardHistorySortedByTime = cardHistory.map(function (change) {
                change.Date = moment(change.DateTime, dateFormat).format('X');

                return change;
            }).sort(function(a, b) {
                return parseInt(a.Date, 10) - parseInt(b.Date, 10);
            });

            var start = _.find(cardHistorySortedByTime, {ToLaneTitle: config.fromLane});
            var end = _.find(cardHistorySortedByTime.reverse(), {ToLaneTitle: config.toLane});

            if (!start || !end) {
                return false;
            }

            firstTimeWipped = moment(start.DateTime, dateFormat);
            lastTimeDone = moment(end.DateTime, dateFormat);

            var totalTime = firstTimeWipped.weekDays(lastTimeDone);
            card.TimeInDays = totalTime;
        });
    });
    var interval = setInterval(function () {
        if (called === numberOfCards) {
            clearInterval(interval);
            next();
        }
    }, 1000);

};
