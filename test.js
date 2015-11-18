var app = require('./app');
var supertest = require('supertest');
require('chai').should();
var nock = require('nock');
var nockedReqs = require('./nock');
var fs = require('fs');

describe('leankit times', function () {
    beforeEach(function(){
        nockedReqs(nock);
    });

    afterEach(function(){
        nock.cleanAll();
    });

    it('should do something', function (done) {

        supertest(app)
            .get('/')
            .end(function(err, res){
                fs.readFileSync('./correct.txt', 'utf8').should.equal(res.text);
                done();
            })
    });
});
