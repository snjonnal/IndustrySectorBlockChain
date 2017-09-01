var UsecaseController = function(usecaseModel) {
  this.usecaseModel = usecaseModel;
  this.ApiResponse = require('../models/api-response');
  this.usecaseFilter = ["Image", "#", "Industry","Sector", "Account", "Shortlisted Use Case", "Account SPOC", "Status"];

  UsecaseController.prototype.getUsecaseData = function(callback) {
    var me = this;
    me.usecaseModel.find({}, {
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

      var strJson = "[";
      // filter the data
      for(var i=0; i<data.length;i++){
         strJson += "{"
        for (var j=0; j<me.usecaseFilter.length;j++) {
           strJson += '"' + me.usecaseFilter[j]+'":"' + data[i][me.usecaseFilter[j]]  + '"';
           if (j < me.usecaseFilter.length-1) {
              strJson += ',';
            }
        }
        strJson += "}"
        if (i < data.length-1) {
           strJson += ',';
         }
      }
      strJson +="]";
      jsonData = JSON.parse(strJson);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: jsonData
        }
      }));
    })
  }

  UsecaseController.prototype.insertUsecaseData = function(usecaseData, callback) {
    var me = this;
    me.usecaseModel.remove({}, function(data){
      console.log('removed successfully');
      console.log(data);
    })
    me.usecaseModel.create(usecaseData, (err, usecases) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }
      console.log('usecases' + usecases.length);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: usecases
        }
      }));
    })
  }
}

module.exports = UsecaseController;
