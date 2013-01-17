var should = require('should'),
    queixinhas_db = require('../lib/db/db');

// Change the default BD configs
queixinhas_db.db_name = 'queixinhas_tests';

describe('MongoDB accesser', function(){
  it('should save, load, find, modify and remove a document in the database', function(done){
    var value = Date.now();

    queixinhas_db.save('test', {value: value}, function(error, id){

      queixinhas_db.load('test', id, function(error, doc){
        doc.value.should.equal(value);

        queixinhas_db.find('test', {value: value}, function(error, docs) {
          docs[0].value.should.equal(value);
          
          var new_value = Date.now();

          queixinhas_db.update('test', id, {value: new_value}, function(error, doc){
            doc.value.should.equal(new_value);
          
            queixinhas_db.remove('test', id, function(error, docs){

              queixinhas_db.load('test', id, function(error, doc){
                should.not.exist(doc);

                done();
              });
            });
          });
        });
      });
    });
  });	
});