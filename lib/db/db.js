/**
 * db
 * Module which exposes mongo database access
 */

var db = {

  host: '127.0.0.1',

  port: 27017,

  db_name: 'queixinhas',

  load: function (collection_name, id, callback){
    var mongodb = require('mongodb');
    var ObjectId = require('mongodb').ObjectID;

    var server = new mongodb.Server(this.host, this.port, {});
    new mongodb.Db(this.db_name, server, {}).open(function (error, client) {
      if (error) {
        callback(error, null);
      }
      else{
        var collection = new mongodb.Collection(client, collection_name);

        collection.find({_id: ObjectId(id)}).toArray(function (error, docs) {
          callback(error, docs);
        });	
      }
    });
  },

  save: function (collection_name, doc, callback){
    var mongodb = require('mongodb');

    var server = new mongodb.Server(this.host, this.port, {});
    new mongodb.Db(this.db_name, server, {}).open(function (error, client) {
      if (error) {
        callback(error, null);
      }
      else{
        var collection = new mongodb.Collection(client, collection_name);

        collection.insert(doc, {safe: true}, function(error, doc){
          callback(error, doc &&  doc[0] && doc[0]._id.toString());
        });
      }
    });
  },

  remove: function (collection_name, id, callback){
    var mongodb = require('mongodb');
    var ObjectId = require('mongodb').ObjectID;

    var server = new mongodb.Server(this.host, this.port, {});
    new mongodb.Db(this.db_name, server, {}).open(function (error, client) {
      if (error) {
        callback(error, null);
      }
      else{
        var collection = new mongodb.Collection(client, collection_name);

        collection.remove({_id: ObjectId(id)}, function(error, docs){
          callback(error, docs);
        });
      }
    });
  }
};

module.exports = db;