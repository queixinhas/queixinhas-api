var should = require('should'),
    queixinhasDB = require('../lib/db/db'),
    reportsDAL = require('../lib/db/dal').Reports,
    Report = require('../lib/models').Report;

// Change the default BD configs
queixinhasDB.db_name = 'queixinhas_tests';

describe('Reports DAL', function(){
  it('should save, load and delete report', function(done) {
    
    var actual = new Report({
      name: 'report',
      description: 'a report',
      tags: ['tag#1', 'tag#2'],
      location: {lon: -9, lat: 39},
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

  it('should load reports by bounding box', function(done) {

    var report1 = new Report({
      name: 'report',
      description: 'a report',
      tags: ['tag#1', 'tag#2'],
      location: {lon: -9, lat: 39},
      address: 'in the sea',
      mediaItems: ['http://image.com']
    });

    var report2 = new Report({
      name: 'report',
      description: 'a report',
      tags: ['tag#1', 'tag#2'],
      location: {lon: -4, lat: 40},
      address: 'in the sea',
      mediaItems: ['http://image.com']
    });
    
    reportsDAL.save(report1, function(error, id1) {
      report1.id = id1;
      
      reportsDAL.save(report2, function(error, id2) {
        report2.id = id2;

        reportsDAL.loadByBBOX({left: -10, top: 40, right: -8, bottom: 38}, function(error, reports) {
          try {
            reports.length.should.equal(1);
            reports[0].id.should.equal(id1);
          }
          finally {
            reportsDAL.delete(id1, function(error, doc) {
            
              reportsDAL.delete(id2, function(error, doc) {
                done();
              });
            });
          }
        });
      });
    });
  });
});