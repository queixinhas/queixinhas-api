/*
 * The report model
 */
var events = require('events'),
  util = require('util');

require('object.extend');

var Model = function(options) {
  events.EventEmitter.call(this);

  // Report properties
  this.collection = 'reports';
  this.id = null;
  this.name = null;
  this.description = null;
  this.tags = [];
  this.location = {};
  this.address = null;
  this.mediaItems = [];
  this.extend(options || {});
};
util.inherits(Model, events.EventEmitter);

Model.prototype.toJSON = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    tags: this.tags,
    location: this.location,
    address: this.address,
    mediaItems: this.mediaItems
  };
};

module.exports = Model;