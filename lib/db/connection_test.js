var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
    new mongodb.Db('queixinhas', server, {}).open(function (error, client) {
      if (error) throw error;
      var collection = new mongodb.Collection(client, 'queixinhas');
      collection.find({}, {limit:10}).toArray(function(err, docs) {
        console.dir(docs);
      });
});
