/**
 * Queixinhas-DAL-Reports
 * Module which handles Reports to and from the DB
 */

var queixinhasDB = require('../db')
    Report = require('../../models').Report;

var reports = {
  collection: 'reports',

  load: function(id, callback) {
    queixinhasDB.load(this.collection, id, function(error, doc) {
      var report = null;
      
      if(doc) {
        doc.id = doc._id.toString();
        delete doc._id;

        report = new Report(doc);
      }

      callback(error, report);
    });
  },

  save: function(report, callback) {
    var doc = report.toJSON();
    delete doc.id;
    queixinhasDB.save(this.collection, doc, callback);
  },

  delete: function(id, callback) {
    queixinhasDB.remove(this.collection, id, callback)
  }
};

module.exports = reports;