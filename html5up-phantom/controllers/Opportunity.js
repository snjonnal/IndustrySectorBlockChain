var OpportunityController = function(opportunityModel) {

  this.opportunityModel = opportunityModel;
  this.ApiResponse = require('../models/api-response');

  OpportunityController.prototype.getOpportunityData = function(req, callback) {
    var me = this;
    var salesStage = req.query.sales_stage;
    me.opportunityModel.find({}, {
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
      var jsonContent = data;

      // filtering the jsonData for Industry Comp Srv
      jsonContent = jsonContent.filter(function(element){
        return element["Industry"] !== "Comp Svc & Prof Svc" && element["Brand"] === "GBS";
      });
      if(salesStage){
        var salesStageArr = salesStage.split(',');
        jsonContent = jsonContent.filter(function(element) {
          for(var i=0;i<salesStageArr.length; i++){
            if(element["Sales Stage"].startsWith(salesStageArr[i])){
              return true;
            }
          }
          return false;
        });
      }
      //res.send(JSON.stringify(data));
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: jsonContent
        }
      }));
    })
  }

  OpportunityController.prototype.insertOpportunityData = function(opportunityData, callback) {
    console.log("Inserting data to database");
    var me = this;
    me.opportunityModel.create(opportunityData, (err, opportunities) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }
      //console.log('opportunities' + opportunities.length);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: opportunities
        }
      }));
    })
  }

  OpportunityController.prototype.getOpportunityDataIndustrywise = function(callback) {
    var me = this;
    var responseData = {};
    var industries = [];
    var qtrs = [];
    me.opportunityModel.find({}, {
      _id: 0
    }).exec((err, data) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }

      // filtering the data for Industry Comp Srv
      data = data.filter(function(element){
        return element["Industry"] !== "Comp Svc & Prof Svc" && element["Brand"] === "GBS";
      })
      //console.log(data.length);
      data.forEach(function(element) {
        var qtr = element["Qtr"];
        if (qtr !== "" && !responseData.hasOwnProperty(qtr)) {
          if (!qtrs.includes(qtr))
            qtrs.push(qtr);
          responseData[qtr] = {};
        }
        var industry = element["Industry"];
        if (industry !== "") {
          if (!responseData[qtr].hasOwnProperty(industry)) {
            if (!industries.includes(industry))
              industries.push(industry);
            responseData[qtr][industry] = 0.0;
          }
          responseData[qtr][industry] += parseFloat(element["Oppty Value (USD mn)"]);
        }
      });

      //console.log(responseData);
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: responseData,
          industries: industries.sort(),
          qtrs: qtrs.sort()
        }
      }));

    })
  }


  OpportunityController.prototype.getOpportunityDataStageWon = function(callback) {
    var me = this;
    me.opportunityModel.find({}, {
      _id: 0
    }).exec((err, data) => {
      if (err) {
        return callback(err, new me.ApiResponse({
          success: false,
          extras: {
            msg: "Database Error"
          }
        }));
      }
      var jsonContent = data.filter(function(element) {
        return element["Sales Stage"] === "07-Won/Implementing";
      });

      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: jsonContent
        }
      }));
  });
}

}

module.exports = OpportunityController;
