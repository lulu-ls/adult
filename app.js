var express = require('express');
var path = require('path');
var session = require('express-session');
// var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authorize = require('./utility/authorize.js');
// var redisStore = require('./utility/redisUtility.js').store;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

var appPath = path.join(__dirname, 'public', 'app');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//     store: new RedisStore({
//         client: redisStore
//     }),
//     secret: 'www',
//     resave: false,
//     saveUninitialized: false
// }));


app.use('/login', express.static(path.join(appPath, 'index.html')));
app.use('/api/login',require('./routes/login'));
app.use('/api/jtlist',authorize.back,require('./routes/jtlist'));
app.use('/api/coupon', authorize.back,  require('./routes/coupon'));
app.use('/api/card', authorize.back,  require('./routes/card'));
app.use('/list',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/tickets',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/details',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/order',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/main',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/settings',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/problem',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/agreement',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/records',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/card',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/cardAdd',authorize.front,express.static(path.join(appPath, 'index.html')));
app.use('/coupon',authorize.front,express.static(path.join(appPath, 'index.html')));


app.use('/',express.static(path.join(appPath, 'index.html')));
app.use('/choose',express.static(path.join(appPath, 'index.html')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;

