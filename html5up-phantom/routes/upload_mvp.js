var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var fs = require('fs');
var MVP = require('../models/mvp');
var MVPController = require('../controllers/MVP');

var storage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({
  // multer settings
  storage: storage,
  fileFilter: function(req, file, callback) { //file filter
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
}).single('file');

module.exports = (app) => {
  /** API path that will upload the files */
  app.post('/upload_mvp', function(req, res) {
      var exceltojson;
      upload(req,res,function(err){
          if(err){
               res.json({error_code:1,err_desc:err});
               return;
          }
          /** Multer gives us file info in req.file object */
          if(!req.file){
              res.json({error_code:1,err_desc:"No file passed"});
              return;
          }
          /** Check the extension of the incoming file and
           *  use the appropriate module
           */
          if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
              exceltojson = xlsxtojson;
          } else {
              exceltojson = xlstojson;
          }
          console.log(req.file.path);
          try {
              exceltojson({
                  input: req.file.path,
                  output: null  //'assets/data/data1.json' //since we don't need output.json
                  //lowerCaseHeaders:true
              }, function(err,result){
                  if(err) {
                      return res.json({error_code:1,err_desc:err, data: null});
                  }

                  // adding values to Database
                  var mvpController = new MVPController(MVP);
                  mvpController.insertMVPData(result, (err, response) => {
                    console.log('Data added to database');
                  });

                  fs.writeFileSync('./assets/data/data5.json', JSON.stringify(result), 'utf-8');
                  res.json({error_code:0,err_desc:null, data: result});
              });
          } catch (e){
              res.json({error_code:1,err_desc:"Corrupted excel file"});
          }
      })
  });

  app.get('/upload_mvp', function(req, res) {
    res.render('upload', {title: 'upload'});
  });
}
