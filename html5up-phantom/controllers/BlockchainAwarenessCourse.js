var BlockchainAwarenessCourseController = function(blockchainAwarenessCourseModel) {
  this.blockchainAwarenessCourseModel = blockchainAwarenessCourseModel;
  this.ApiResponse = require('../models/api-response');

  BlockchainAwarenessCourseController.prototype.getBlockchainAwarenessCourseData = function(callback) {
    var me = this;
    me.blockchainAwarenessCourseModel.find({}, {
      _id: 0
    }).select('-__v').exec((err, data) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }

      jsonData = data;
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: jsonData
        }
      }));
    })
  }

  BlockchainAwarenessCourseController.prototype.insertBlockchainAwarenessCourseData = function(blockchainAwarenessCourseData, callback) {
    var me = this;
    me.blockchainAwarenessCourseModel.remove({}, function(){
      console.log('removed successfully');
    })
    me.blockchainAwarenessCourseModel.create(blockchainAwarenessCourseData, (err, blockchainAwarenessCourses) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }
      console.log('blockchainAwarenessCourses' + blockchainAwarenessCourses.length);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: blockchainAwarenessCourses
        }
      }));
    })
  }
}

module.exports = BlockchainAwarenessCourseController;
