var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// engine
var ejs = require('ejs');
var engine = require('ejs-mate');
var cfenv = require('cfenv');
var app = express();
var fs = require('fs');

// Util is handy to have around, so thats why that's here.
const util = require('util')
// and so is assert
const assert = require('assert');

// true if running local
var runningLocal = true;

// adding middlewares
app.use(express.static('assets'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.locals.stylesheets = [];
app.locals.renderLinkTags = function (all) {
  app.locals.stylesheets = [];
  if (all != undefined) {
    return all.map(function(stylesheet) {
      return '<link href="' + stylesheet + '" rel="stylesheet"></link>';
    }).join('\n ');
  }
  else {
    return '';
  }
}
app.locals.getStylesheets = function(req, res) {
  return stylesheets;
}

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

if (runningLocal) {
  var ca = [fs.readFileSync(__dirname + "/servercert.crt")];
  var options = {
    mongos: {
        ssl: true,
        sslValidate: true,
        sslCA:ca,
    }
}
  mongoose.connect('mongodb://admin:IWUCVIPVDZZYZFUB@bluemix-sandbox-dal-9-portal.2.dblayer.com:29621,bluemix-sandbox-dal-9-portal.1.dblayer.com:29621/admin?ssl=true', options);
}
else{
// Within the application environment (appenv) there's a services object
var services = appEnv.services;

// The services object is a map named by service so we extract the one for MongoDB
var mongodb_services = services["compose-for-mongodb"];

// This check ensures there is a services for MongoDB databases
assert(!util.isUndefined(mongodb_services), "Must be bound to compose-for-mongodb services");

// We now take the first bound MongoDB service and extract it's credentials object
var credentials = mongodb_services[0].credentials;
//var credentials = mongo_cred;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];

mongoose.connect(credentials.uri, {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: ca,
            poolSize: 1,
            reconnectTries: 1
        }
    });
  }

//mongoose.connect('mongodb://admin:admin@ds135680.mlab.com:35680/blockchain_solutions');

//routes
require('./routes/route')(app);
require('./routes/upload_usecase')(app);
require('./routes/upload')(app);
require('./routes/upload_mvp')(app);
require('./routes/upload_badge')(app);
require('./routes/upload_blockchainAwarenessCourse')(app);


var port = app.get('PORT') || 3000;

// if (runningLocal) {
//   app.listen(port, function() {
//     console.log('App running on 3000');
//   });
// } else {

  // start server on the specified port and binding host
  app.listen(appEnv.port, appEnv.bind, function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
  });
//}
