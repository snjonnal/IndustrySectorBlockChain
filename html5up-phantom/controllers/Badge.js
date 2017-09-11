var BadgeController = function(badgeModel) {
  this.badgeModel = badgeModel;
  this.ApiResponse = require('../models/api-response');

  BadgeController.prototype.getBadgeData = function(callback) {
    var me = this;
    me.badgeModel.find({}, {
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

  BadgeController.prototype.insertBadgeData = function(badgeData, callback) {
    var me = this;
    me.badgeModel.remove({}, function(){
      console.log('removed successfully');
    })
    me.badgeModel.create(badgeData, (err, badges) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }
      console.log('badges' + badges.length);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: badges
        }
      }));
    })
  }
}

module.exports = BadgeController;
