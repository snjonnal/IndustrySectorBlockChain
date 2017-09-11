var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// engine
var ejs = require('ejs');
var engine = require('ejs-mate');
var cfenv = require('cfenv');
var app = express();

// true if running local
var runningLocal = false;

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

// app.locals({
//     stylesheets: [],
//   renderScriptsTags: function (all) {
//     app.locals.stylesheets = [];
//     if (all != undefined) {
//       return all.map(function(stylesheet) {
//         return '<link href="/css/' + stylesheet + '" rel="stylesheet"></link>';
//       }).join('\n ');
//     }
//     else {
//       return '';
//     }
//   },
//   getStylesheets: function(req, res) {
//     return stylesheets;
//   }
// });

mongoose.connect('mongodb://admin:admin@ds135680.mlab.com:35680/blockchain_solutions');

//routes
require('./routes/route')(app);
//require('./routes/upload_usecase')(app);
require('./routes/upload')(app);


var port = app.get('PORT') || 3000;

if (runningLocal) {
  app.listen(port, function() {
    console.log('App running on 3000');
  });
} else {
  // get the app environment from Cloud Foundry
  var appEnv = cfenv.getAppEnv();
  // start server on the specified port and binding host
  app.listen(appEnv.port, appEnv.bind, function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
  });
}
