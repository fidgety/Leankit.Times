var app = require('./app');
var supertest = require('supertest');
var nock = require('nock');
var nockedReqs = require('./nock');
var fs = require('fs');

nockedReqs(nock);

supertest(app)
    .get('/')
    .end(function(err, res){
        fs.writeFileSync('./correct.txt', res.text, 'utf8');
    });
