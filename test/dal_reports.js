var should = require('should'),
    queixinhasDB = require('../lib/db/db'),
    reportsDAL = require('../lib/db/dal').Reports,
    Report = require('../lib/models').Report;

// Change the default BD configs
queixinhasDB.db_name = 'queixinhas_tests';

describe('Reports DAL', function(){
  it('should save, load and delete report', function(done){
    
    var actual = new Report({
      name: 'report',
      description: 'a report',
      tags: ['tag#1', 'tag#2'],
      loc: {lon: -9, lat: 39},
      address: 'in the sea',
      mediaItems: ['http://image.com']
    });

    reportsDAL.save(actual, function(error, id) {
      actual.id = id;

      reportsDAL.load(id, function(error, expected) {
        actual.should.eql(expected);

        reportsDAL.delete(id, function(error, doc) {
          reportsDAL.load(id, function(error, expected) {
            should.not.exist(expected);

            done();
          });
        });
      });
    });
  });	
});