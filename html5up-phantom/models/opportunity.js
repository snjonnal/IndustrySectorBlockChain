var mongoose = require('mongoose');

var opportunitySchema = mongoose.Schema({
  'Opportunity Number': {type:String, required: true},
  'IOT': {type:String, required: false},
  'Client name': {type:String, required: false},
  'Description': {type:String, required: false},
  'Engaged': {type:String, required: false},
  'Engaged CIC': {type:String, required: false},
  'Qtr': {type:String, required: false},
  'Industry': {type:String, required: false},
  'Sales Stage' : {type:String, required: false},
  'Oppty Value (USD mn)': {type:String, required: false},
  'Opportunity owner': {type:String, required: false}
});


module.exports = mongoose.model('opportunity', opportunitySchema);
