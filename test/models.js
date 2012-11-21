var should = require('should'),
    models = require('../lib/models');

describe('Models', function(){
    describe('Report', function(){

        var Report = models.Report;

        it('should be synched with the DB', function(done){
            var report = new Report({
                name: 'report',
                description: 'a report',
                tags: ['tag#1', 'tag#2'],
                location: {lon: -9, lat: 39},
                address: 'in the sea'
            });

            // Change the default BD configs
            report.queixinhas_db.db_name = 'queixinhas_tests';

            report.on('save', function(){
                report = new Report({
                    id: report.id
                });

                report.on('load', function(){
                    report.name.should.equal('report');
                    report.description.should.equal('a report');
                    report.tags.should.eql(['tag#1', 'tag#2']);
                    report.location.should.eql({lon: -9, lat: 39});
                    report.address.should.equal('in the sea');

                    report.on('delete', function(){
                        done();
                    });

                    report.delete();
                });

                report.load();
            });

            report.save();
        });    
    });	
});