/*
 * The report model
 */
var events = require('events'),
    util   = require('util');

require('object.extend');

var Model = function(options){
	events.EventEmitter.call(this);
	// Report properties
	this.collection = 'reports';
	this.id;
	this.name = null;
	this.description = null;
	this.tags = [];
	this.location = null;
	this.address = null;

	this.extend(options || {});

	//Set a reference to the DB accessor
	this.queixinhas_db = require('../db/db.js')
};
util.inherits(Model, events.EventEmitter);

Model.prototype.save = function(){
  var props = this.toJSON();

  if(!props.id){
    delete props.id;

    this.queixinhas_db.save(this.collection, props, function(error, id){
      if(error){
        this.emit('error');
      }
      else{
        this.id = id;
        this.emit('save');
      }
    }.bind(this));
  }
  else{
    var id = props.id;
    delete props.id;

    this.queixinhas_db.update(this.collection, id, props, function(error, doc){
      if(error){
        this.emit('error');
      }
      else{
        this.emit('save');
      }
    });
  }
};

Model.prototype.load = function(){
  if(!this.id){
    return;
  }

  this.queixinhas_db.load(this.collection, this.id, function(error, reports){
    if(error){
      this.emit('error');
    }
    else{
      this.extend(reports[0]);
      this.emit('load');
    }
  }.bind(this));
};

Model.prototype.delete = function(){
  if(!this.id){
    return;
  }

  this.queixinhas_db.remove(this.collection, this.id, function(error, report){
    if(error){
      this.emit('error');
    }
    else{
      this.emit('delete');
    }
  }.bind(this));
};

Model.prototype.toJSON = function(){
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    tags: this.tags,
    location: this.location,
    address: this.address
  };
};

 module.exports = Model;