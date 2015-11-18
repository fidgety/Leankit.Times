var request = require('supertest');
var app = require('../app');
var nockRec = require('./nockRec')();
var fs = require('fs');
var masterStub = fs.readFileSync('./masterStub.txt', 'utf-8');
var chai = require('chai').should();

describe('Leankit Tests', function () {


    it('response should be the same as the master copy', function(done) {
        request(app)
          .get('/')
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            //fs.writeFileSync('./masterStub.txt', res.text, 'utf-8');
            res.text.should.equal(masterStub);
            done();
          });
    });
});
