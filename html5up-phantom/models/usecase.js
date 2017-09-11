var mongoose = require('mongoose');

var usecaseSchema = mongoose.Schema({
  '#': {type:String, required: true},
  'Sector': {type:String, required: false},
  'Industry': {type:String, required: false},
  'Account': {type:String, required: false},
  'Account Manager': {type:String, required: false},
  'Account SPOC': {type:String, required: false},
  'Shortlisted Use Case': {type:String, required: false},
  'Status': {type:String, required: false},
  'Submited for iNSIDE Track': {type:String, required: false},
  'Team Details': {type:String, required: false},
  'Scheduled Date': {type:String, required: false},
  'Comments': {type:String, required: false},
  'Final Status': {type:String, required: false},
  'Value Add to IBM': {type:String, required: false},
  'Value Add to Client': {type:String, required: false},
  'Potential Saving': {type:String, required: false},
  'Critical': {type:String, required: false}
  //'Image': {type:String, required: false}
});


module.exports = mongoose.model('usecase', usecaseSchema);
