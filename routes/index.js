var express = require('express');
var router = express.Router();
var _ = require('lodash');
var featureCards = require('../middleware/featureCards');

module.exports = function (splitSizes, cardTimes, lastTimeDone, groupByWeek, averageSizes, removeZeroSizes) {

    /* GET home page. */
    router.get('/', function (req,res,next) {
        featureCards().then(function(data){
            req.features = data;
            next();
        })
        .catch(next);
    },
        splitSizes,
        cardTimes,
        function (req, res) {
            var sizeData = [];
            _.forEach(Object.keys(req.sizes), function (key) {
                var sizes = req.sizes[key];
                var dataForThisSize = {
                    size: key,
                    biggestTime: 0,
                    totalTime: 0,
                    averageTime: 0,
                    numberOfCards: 0
                }
                _.forEach(sizes, function (size) {
                    if (!size.TimeInDays) {
                        return;
                    }
                    dataForThisSize.numberOfCards++;
                    dataForThisSize.totalTime += parseInt(size.TimeInDays);
                    if (size.TimeInDays > dataForThisSize.biggestTime) {
                        dataForThisSize.biggestTime = size.TimeInDays;
                    }
                })
                dataForThisSize.averageTime = Math.round(dataForThisSize.totalTime / sizes.length);
                sizeData.push(dataForThisSize);
            });

            res.render('index', {
                title: 'Ticket Times',
                ticketData: sizeData
            });
        });

    /* GET home page. */
    router.get('/averageTicketSize',
    function (req,res,next) {
        featureCards().then(function(data){
            req.features = data;
            next();
        })
        .catch(next);
    },
        removeZeroSizes,
        lastTimeDone,
        groupByWeek,
        averageSizes,
        function (req, res) {
            var sizeData = []
            res.render('sizes', {
                title: 'Ticket Sizes',
                ticketData: req.averageSizes
            });
        });

    return router;
}
