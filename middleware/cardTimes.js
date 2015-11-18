var _ = require('lodash');
var moment = require('moment');
var momentBusiness = require('moment-business');
var Promise = require('bluebird');

var config = require('../config/config');
var leankit = require("leankit-client");
var client = leankit.createClient(config.accountName, config.email, config.password);
var dateFormat = 'DD/MM/YYYY at hh:mm:ss a';

var getCardHistory = Promise.promisify(client.getCardHistory, {context: client});

module.exports = function cardTimes(features) {
    return Promise.all(features.map(function (card) {
        if (card.Size === 0) {
            return card;
        }

        return getCardHistory(config.boardId, card.Id)
            .then(function (cardHistory) {
                var cardHistorySortedByTime = cardHistory.map(function (change) {
                    change.Date = moment(change.DateTime, dateFormat).format('X');

                    return change;
                }).sort(function(a, b) {
                    return Number(a.Date) - Number(b.Date);
                });

                var start = _.find(cardHistorySortedByTime, {ToLaneTitle: config.fromLane});
                var end = _.find(cardHistorySortedByTime.reverse(), {ToLaneTitle: config.toLane});

                if (!start || !end) {
                    return false;
                }

                firstTimeWipped = moment(start.DateTime, dateFormat);
                lastTimeDone = moment(end.DateTime, dateFormat);

                card.TimeInDays = firstTimeWipped.weekDays(lastTimeDone);

                return card;
        });
    }));
};
