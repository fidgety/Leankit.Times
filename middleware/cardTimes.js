var _ = require('lodash');
var moment = require('moment')
var momentBusiness = require('moment-business');
var dateFormat = 'DD/MM/YYYY at hh:mm:ss a';
var Promise = require('bluebird');

module.exports = function createCardTimer(config, client) {
    return function cardTimes(req, res, next) {
        var getCardHistory = Promise.promisify(client.getCardHistory, {context: client});

        Promise.all(req.features.map(function (card) {
            return getCardHistory(config.boardId, card.Id)
                .then(function (cardHistory) {
                    var start = _.find(cardHistory, {ToLaneTitle: config.fromLane});
                    var end = _.find(cardHistory, {ToLaneTitle: config.toLane});

                    if (!start || !end) {
                        return false;
                    }

                    start = moment(start.DateTime, dateFormat);
                    end = moment(end.DateTime, dateFormat);

                    card.TimeInDays = start.weekDays(end);

                    return card;
                });
        }))
        .then(function () {
            next();
        })
        .catch(next);
    }
};
