var mongoose = require('mongoose');

var mvpSchema = mongoose.Schema({
  'Title': {type:String, required: true},
  'Title Description': {type:String, required: false},
  'Problem Statement': {type:String, required: false},
  'Proposed Solution': {type:String, required: false}
});
module.exports = mongoose.model('mvp', mvpSchema);
