/**
 * Queixinhas-DAL-Reports
 * Module which handles Reports to and from the DB
 */

var queixinhasDB = require('../db')
    Report = require('../../models').Report;

var reportsDAL = {
  collection: 'reports',

  load: function(id, callback) {
    queixinhasDB.load(this.collection, id, function(error, doc) {
      var report = reportsDAL.toReport(doc);

      callback(error, report);
    });
  },

  loadByBBOX: function(bbox, callback) {
    var box = [ [bbox.left, bbox.bottom ], [bbox.right, bbox.top] ];

    var query = { loc : { "$within" : { "$box" : box } } };

    queixinhasDB.find(this.collection, query, function(error, docs) {
      var reports = [];
      if(docs) {
        for(var i = 0; i < docs.length; ++i) {
          reports.push(reportsDAL.toReport(docs[i]));
        }
      }

      callback(error, reports);
    });
  },

  loadAll: function(callback) {
    queixinhasDB.find(this.collection, null, function(error, docs) {
      var reports = [];
      if(docs) {
        for(var i = 0; i < docs.length; ++i) {
          reports.push(reportsDAL.toReport(docs[i]));
        }
      }

      callback(error, reports);
    });
  },

  save: function(report, callback) {
    var doc = reportsDAL.fromReport(report.toJSON());
    queixinhasDB.save(this.collection, doc, function(error, id) {
      callback(error, id);
    });
  },

  delete: function(id, callback) {
    queixinhasDB.remove(this.collection, id, callback)
  },

  toReport: function(doc) {
    if(doc) {
      doc.id = doc._id.toString();
      delete doc._id;

      doc.location = {
        lon: doc.loc.x,
        lat: doc.loc.y
      };
      delete doc.loc;

      return new Report(doc);
    }
  },

  fromReport: function(report) {
    var doc = report;
    doc.loc = {
      x: doc.location.lon,
      y: doc.location.lat
    };
    delete doc.location;

    delete doc.id;

    return doc;
  }
};

module.exports = reportsDAL;