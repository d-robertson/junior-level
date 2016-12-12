require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var isLoggedin = require('./middleware/isLoggedin');
var request = require('request');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/'));
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretthing',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});
//My base route sends an api call to dice.com for job postings matching the
//key words entry and junior for development jobs
//I check to see if there were any inputs in my zipcode field from my index.ejs
//If there is a zipcode entered i use it to concat my url in the api call
//and update the results to match
//I then store the results in my session middleware so that if there are no
//changes to the api call i dont have to make another one
app.get('/', function(req, res) {
  if(!req.session.results || req.query.zipcode !== req.session.storedZip){
    console.log('IF!!!!!');
    var url = 'http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=entry+junior';
    if(req.query.zipcode){
      url += '&city=' + req.query.zipcode;
      req.session.storedZip = req.query.zipcode;
    }

    request({
      url: url
    }, function(error, response, body){
      // console.log(response);
      if(!error && response.statusCode === 200){
        var dataObj = JSON.parse(body);
        req.session.results = dataObj.resultItemList;
        res.render('index', { results: req.session.results });
      }
    });
  } else {
    console.log('ELSE!!!!!')
    res.render('index', { results: req.session.results });
  }
});
//my post route hit when the save job button is clicked
//I check to see that the user is logged in
//then find or create a job in my job table and update the join table
app.post('/favJob', function(req, res){
  if(!req.user){
    res.status(401).send('need to be logged in');
  } else {
    db.job.findOrCreate({
      where: {
        title : req.body.title,
        company: req.body.company,
        location: req.body.location,
        url: req.body.url
      }
    }).spread(function(job, isCreated){
      db.user.findOne({
        where: {
          id: req.user.id
        }
      }).then(function(user){
        user.addJob(job);
        res.send();
      });
    });
  }
});
//my user jobs route checks to see if the user is logged in
//finds all the jobs in the join table that the user is associated with
app.get('/jobs', isLoggedin, function(req, res) {
  db.user.findOne({
    where: {
      id: req.user.id
    }
  }).then(function(user){
    user.getJobs().then(function(jobs){
      res.render('jobs', { results: jobs });
    });
  });
});
//My ajax delete route finds the user
//then with the job id as req.params.id deletes the job association
app.delete('/deleteJob/:id', function(req, res){
  db.user.findOne({
    where: {
      id: req.user.id
    }
  }).then(function(user){
    user.removeJob(req.params.id).then(function(){
      res.send('delted job');
    });
  });
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
