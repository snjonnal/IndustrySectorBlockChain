var mongoose = require('mongoose');

var blockchainAwarenessCourseSchema = mongoose.Schema({
  'Sector': {type:String, required: true},
  'Target': {type:String, required: false},
  'Course Completion': {type:String, required: false}
});
module.exports = mongoose.model('blockchainAwarenessCourse', blockchainAwarenessCourseSchema);
