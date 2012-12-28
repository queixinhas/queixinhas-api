/*
 * The image model
 */
var events = require('events'),
    util   = require('util'),
	fs     = require('fs'),
	uuid   = require('node-uuid'),
	config = require('../config');

var Model = function(data, type){
	events.EventEmitter.call(this);

	// The default directory should be set in the configs, not in here
	this.directory = config.mediaDirectory;
	this.data = data;
	this.type = type;
	this.filename = null;
};
util.inherits(Model, events.EventEmitter);

Model.prototype.save = function() {
	if(!this.data) {
		return;
	}

	var extension = null;
	if(this.type) {
		extension = this.type.split('/');
		if(extension.length && extension.length > 1 && extension[1]) {
			extension = '.' + extension[1];
		}
		else {
			extension = '';
		}
	}

	var filename = 'queixinhas_' + uuid.v1() + extension
	fs.writeFile(this.directory + filename, this.data, function(err) {
		if(err) {
			this.emit('error');
			return;
		}

		this.filename = filename;

		this.emit('save');
	}.bind(this));
};

Model.prototype.getURL = function() {
	return config.mediaHost + '/' + this.filename;
};

Model.prototype.getType = function() {
	return this.type;
};

module.exports = Model;
