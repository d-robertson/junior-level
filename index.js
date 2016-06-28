var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var isLoggedin = require('./middleware/isLoggedin');
var request = require('request');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
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

    if(req.query.zipcode || req.query.skill){
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
        res.render('index', { results: dataObj.resultItemList });
      }
    });
  } else {
    console.log('ELSE!!!!!')
    res.render('index', { results: session.results });
  }
});

// app.get('/', function(req, res) {
//   var url = 'https://authenticjobs.com/api/?api_key=1e053aff7cf7550dbc3d62c7529f4124&method=aj.jobs.search&keywords=entry,junior,developer';

//   request({
//     url: url
//   }, function(error, response, body){
//     if(!error && response.statusCode === 200){
//       var dataObj = JSON.parse(body);
//       console.log(dataObj);
//       req.session.results = dataObj;
//       res.render
//     }
//   })
// })

app.get('/profile', isLoggedin, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
