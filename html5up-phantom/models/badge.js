var mongoose = require('mongoose');

var badgeSchema = mongoose.Schema({
  'Sector': {type:String, required: true},
  'Target': {type:String, required: false},
  'Badges': {type:String, required: false}
});
module.exports = mongoose.model('badge', badgeSchema);
