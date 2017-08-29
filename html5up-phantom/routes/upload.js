var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var fs = require('fs');
var Opportunity = require('../models/opportunity');
var OpportunityController = require('../controllers/Opportunity');

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
  app.post('/upload', function(req, res) {
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
          try {
              exceltojson({
                  input: req.file.path,
                  output: null  //'assets/data/data1.json' //since we don't need output.json
                  //lowerCaseHeaders:true
              }, function(err,result){
                  if(err) {
                      return res.json({error_code:1,err_desc:err, data: null});
                  }
                  var props = ["Opportunity Number", "IOT", "Client name", "Description", "Engaged","Engaged CIC","Qtr","Industry", "Sales Stage", "Oppty Value (USD mn)", "Opportunity owner"];
                  var jsonContent = result.filter(function(element){
                    return element["Industry Sector"] === "Industrial";
                  });

                  for(var i=0; i<jsonContent.length;i++){
                    for (var property in jsonContent[i]) {
                        if (jsonContent[i].hasOwnProperty(property) && !props.includes(property)) {
                          //console.log( 'deleting' + property);
                          delete jsonContent[i][property];
                        }
                    }
                  }
                  // adding values to Database
                  var opportunityController = new OpportunityController(Opportunity);
                  opportunityController.insertOpportunityData(jsonContent, (err, response) => {
                    if(err) console.log('Error Occured while updating data to database');
                    else console.log('Data added to database');
                  });

                  fs.writeFileSync('./assets/data/data3.json', JSON.stringify(jsonContent), 'utf-8');
                  res.json({error_code:0,err_desc:null, data: jsonContent});
              });
          } catch (e){
              res.json({error_code:1,err_desc:"Corrupted excel file"});
          }
      })

  });

  app.get('/upload', function(req, res) {
    res.render('upload');
  });
}
