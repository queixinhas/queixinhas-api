/*
 * queixinhas API
 */

var service =  require('./lib/service');
var httpServer = service({ port: 3000 }, function (server) {
  console.log('%s listening at %s', server.name, server.url);
});