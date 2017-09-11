var UsecaseController = function(usecaseModel) {
  this.usecaseModel = usecaseModel;
  this.ApiResponse = require('../models/api-response');
  this.usecaseFilter = ["#", "Industry","Sector", "Account", "Shortlisted Use Case", "Account SPOC", "Status", "Value Add to IBM", "Value Add to Client","Potential Saving", "Critical"];

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
           strJson += '"' + me.usecaseFilter[j]+'":"' + escapeJson(data[i][me.usecaseFilter[j]])  + '"';
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
      //jsonData = JSON.parse(strJson);
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
    me.usecaseModel.remove({}, function(){
      console.log('removed successfully');
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

function escapeJson(str){
  str = str.replace(new RegExp("\"", 'g'),"\\\"");
  str = str.replace(new RegExp("\n", 'g'),"\\n");
  str = str.replace(new RegExp("\r", 'g'),"\\r");
  return str;
}

module.exports = UsecaseController;
