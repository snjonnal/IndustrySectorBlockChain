var OpportunityController = function(opportunityModel) {

  this.opportunityModel = opportunityModel;
  this.ApiResponse = require('../models/api-response');

  OpportunityController.prototype.getOpportunityData = function(callback) {
    var me = this;
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
      //res.send(JSON.stringify(data));
      return callback(err, new me.ApiResponse({
        success: true,
        extras: {
          data: data
        }
      }));

      //res.json({"err": null, "data": data});
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
}

module.exports = OpportunityController;
