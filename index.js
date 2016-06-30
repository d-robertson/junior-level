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
  secret: process.env.SESSION_SECRET,
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

app.post('/favJob', function(req, res){
  console.log('console!');
  // console.log('post route');
  // console.log(req.body);
  if(!req.user){
    console.log('hit the if');
    res.status(401).send('need to be logged in');
  } else {
    console.log('hit the else');
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

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
