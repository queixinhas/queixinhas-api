module.exports = function(options, callback) {

  var fs = require('fs'),
      restify = require('restify'),
      util = require('util');

  var serverOptions = {
    name: 'queixinhas-API',
    version: '0.0.1'
  };

  var server = restify.createServer(serverOptions);

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  /**
   * HACK to accept some custom headers
   *
   * This should be removed when restify supports
   * another way of doing this.
   * This is expected in version 2.0
   */
  var monkey_response = require("http").ServerResponse;
  var original_writeHead = monkey_response.prototype.writeHead;
  monkey_response.prototype.writeHead = function () {
    var default_headers = this.getHeader("Access-Control-Allow-Headers");
    if (default_headers) {
      this.setHeader("Access-Control-Allow-Headers", default_headers + ", X-Mime-Type, X-Requested-With, X-File-Name, Cache-Control");
    }   
    original_writeHead.apply(this, arguments);
  }

  // Get the DAL
  var DAL = require('./db/dal');

  // Get the models
  var model = require('./models');
  var Report = model.Report;
  var Image = model.Image;

  /**
   * GET /reports/:reportID
   *
   * Returns the report with the given ID
   */
  server.get('/reports/:reportID', function(req, res, next) {
    DAL.Reports.load(req.params.reportID, function(error, report) {
      res.send(report.toJSON());
    });
  });

  /**
   * GET /reports?bbox=left,bottom,right,top
   */
  server.get('/reports?:bbox', function(req, res, next) {
    var bbox = req.params.bbox.split(',');
    bbox = {
      left: Number(bbox[0]),
      bottom: Number(bbox[1]),
      right: Number(bbox[2]),
      top: Number(bbox[3])
    };
    DAL.Reports.loadByBBOX(bbox, function(error, reports) {
      res.send(reports);
    });
  });

  /**
   * POST /reports
   *
   * Creates a new report
   */
  server.post('/reports', function(req, res, next) {
    var report = new Report(req.params);
    
    DAL.Reports.save(report, function(error, id) {
      report.id = id;
      res.send(report.toJSON());
    });
  });

  /**
   * POST /images
   *
   * Creates a new image
   */
  server.post('/images', function(req, res, next) {
    if(req.files) {
      for(var f in req.files) {
        fs.readFile(req.files[f].path, function(err, data) {
          if(err) {
            // throw error
          }

          if(data) {
            var image = new Image(data, req.files[f].type);

            image.on('save', function() {
              res.send({
                'success': true,
                'url': image.getURL()
              });
            });

            image.save();
          }
        });
      }
    }
  });

  // Put the service listening
  server.listen(options.port, function() {
    if (callback) {
      callback(server);
    }
  });
};