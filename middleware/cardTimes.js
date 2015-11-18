var _ = require('lodash');
var moment = require('moment');
var leankit = require('leankit-client');
var config = require('../config/config');
var client = leankit.createClient(config.accountName, config.email, config.password);
var Promise = require('bluebird');
var getCardHistory = Promise.promisify(client.getCardHistory, {
    context: client
});

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

//find the amount of days the card was 'active'

module.exports = function cardTimes(req, res, next) {
        var called = 0;
        var numberOfCards = 0;

        _.forEach(Object.keys(req.sizes), function (key) {
            if (key === '0') return;
            var cards = req.sizes[key];

            var cardPromises = cards.map(function (card) {
                return getCardHistory(config.boardId, card.Id)
            });

            Promise.all(cardPromises).then(function (changes) {
                console.log(changes.length);

            }).catch(function (err) {
                console.log('catch');
            })


        });

    }
