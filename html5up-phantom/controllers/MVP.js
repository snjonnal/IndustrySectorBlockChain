var MVPController = function(mvpModel) {
  this.mvpModel = mvpModel;
  this.ApiResponse = require('../models/api-response');

  MVPController.prototype.getMVPData = function(callback) {
    var me = this;
    me.mvpModel.find({}, {
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

  MVPController.prototype.insertMVPData = function(mvpData, callback) {
    var me = this;
    me.mvpModel.remove({}, function(data){
      console.log('removed successfully');
    })
    me.mvpModel.create(mvpData, (err, mvps) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }
      console.log('mvps' + mvps.length);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: mvps
        }
      }));
    })
  }
}

module.exports = MVPController;
