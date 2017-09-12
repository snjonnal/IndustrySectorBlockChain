var fs = require('fs');
var Opportunity = require('../models/opportunity');
var Usecase = require('../models/usecase');
var MVP = require('../models/mvp');
var Badge = require('../models/badge');
var BlockchainAwarenessCourse = require('../models/blockchainAwarenessCourse');
var MVPController = require('../controllers/MVP.js');
var OpportunityController  = require('../controllers/Opportunity.js');
var UsecaseController  = require('../controllers/Usecase.js');
var BadgeController  = require('../controllers/Badge.js');
var BlockchainAwarenessCourseController  = require('../controllers/BlockchainAwarenessCourse.js');

module.exports = (app) => {
  console.log('inside route.js');

  app.get('/', function(req,res, next){
    res.render('index1', {title: 'Blockchain Solution'});
  });

  app.get('/index', function(req,res, next){
    res.render('index1', {title: 'Blockchain Solution'});
  });

  app.get('/opportunities', function(req,res, next){
    res.render('opportunities', {title: 'Blockchain Solution'});
  });

  app.get('/use-cases', function(req,res, next){
    res.render('use-cases', {title: 'Blockchain Usecases'});
  });

  app.get('/trainings', function(req,res, next){
    res.render('trainings', {title: 'Blockchain Trainings'});
  });
  app.get('/mvp', function(req,res, next){
    res.render('mvp', {title: 'Blockchain MVP'});
  });
  app.get('/whats_new', function(req,res, next){
    res.render('whats_new', {title: 'What\'s New '});
  });
  app.get('/client_wins', function(req,res, next){
    res.render('client_wins', {title: 'Client\'s Win '});
  });
  app.get('/contacts', function(req,res, next){
    res.render('contacts', {title: 'Blockchain Contacts'});
  });


// to delete
  app.get('/generic', function(req,res, next){
    res.render('generic', {title: 'Blockchain Solution'});
  });

  // to delete
    app.get('/index1', function(req,res, next){
      res.render('index1', {title: 'Blockchain Solution'});
    });
    // to delete
    app.get('/mvp1', function(req,res, next){
      res.render('mvp1', {title: 'Blockchain MVP'});
    });
    // to delete
    app.get('/test_mvp', function(req,res, next){
      res.render('test_mvp', {title: 'Blockchain MVP'});
    });

  app.get('/opp_data', function(req,res, next){
    var opportunityController = new OpportunityController(Opportunity);
    opportunityController.getOpportunityData(req, (err, response) => {
      return res.send(response);
    });
  });

  app.get('/opp_based_on_industry', function(req,res, next){
    var opportunityController = new OpportunityController(Opportunity);
    opportunityController.getOpportunityDataIndustrywise((err, response) => {
      console.log('testing');
      return res.send(response);
    });
  });

  app.get('/opp_based_on_industry', function(req,res, next){
    var opportunityController = new OpportunityController(Opportunity);
    opportunityController.getOpportunityDataIndustrywise((err, response) => {
      console.log('testing');
      return res.send(response);
    });
  });

  app.get('/opp_based_on_industry', function(req,res, next){
    var opportunityController = new OpportunityController(Opportunity);
    opportunityController.getOpportunityDataIndustrywise((err, response) => {
      console.log('testing');
      return res.send(response);
    });
  });

  app.get('/usecase_data', function(req,res, next){
    var usecaseController = new UsecaseController(Usecase);
    usecaseController.getUsecaseData((err, response) => {
      return res.send(response);
    });
  });

  app.get('/mvp_data', function(req,res, next){
    var mvpController = new MVPController(MVP);
    mvpController.getMVPData((err, response) => {
      return res.send(response);
    });
  });

  app.get('/badge_data', function(req,res, next){
    var badgeController = new BadgeController(Badge);
    badgeController.getBadgeData((err, response) => {
      return res.send(response);
    });
  });

  app.get('/blockchainAwarenessCourse_data', function(req,res, next){
    var blockchainAwarenessCourseController = new BlockchainAwarenessCourseController(BlockchainAwarenessCourse);
    blockchainAwarenessCourseController.getBlockchainAwarenessCourseData((err, response) => {
      return res.send(response);
    });
  });

  app.get('/test', function(req,res, next){
    res.render('test', {title: 'Blockchain Solution'});
  });

}
