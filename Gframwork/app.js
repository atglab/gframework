/**
 * [GFServer] app.js
 * 
 * Module used to launch GFServer. 
 * It is based on the express module.
 * 
 * @author JungHyun
 * @version 0.4
 */
var express = require('express')
  , http = require('http')
  , bodyParser = require('body-parser');

// set global variables
global.rootPath = process.cwd();
global.config = require(global.rootPath + '/resources/config/config');
global.errorcode = require(global.rootPath + '/resources/config/errorcode');

global.EVENTS = require(global.rootPath + '/helpers/constants').EVENTS;
global.MECHANICS = require(global.rootPath + '/helpers/constants').MECHANICS;
global.REWARD_EVENTS = require(global.rootPath + '/helpers/constants').REWARD_EVENTS;
global.OTHER_CONSTANTS = require(global.rootPath + '/helpers/constants').OTHER_CONSTANTS;

//set development mode
process.env.NODE_ENV = 
	( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) 
	? 'production' : 'development';

var logger = require(global.rootPath + '/helpers/logger');

var moment = require('moment');
moment.locale('kr', {
    relativeTime: {
        future: "%s 후",
        past:   "%s 전",
        s:  "1 초",
        m:  "1 분",
        mm: "%d 분",
        h:  "1 시간",
        hh: "%d 시간",
        d:  "1 일",
        dd: "%d 일",
        M:  "1 개월",
        MM: "%d 개월",
        y:  "1 년",
        yy: "%d 년"
    }
});

// set express
var app = express();
app.set('port', process.env.PORT || global.config.app.port);

// set express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
//app.use(express.static("E:/Backup Data"));

app.use(function(req, res, next){
	logger.log('info', 'app.js', 'Request: ' + req.method + ' ' + req.url + ' start');
	next();
});

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

// set routes
//require(global.rootPath + '/routes/router.js').routes(app);
app.use('/', require(global.rootPath + '/routes/router.js'));

app.use(function(req, res, next){
	logger.log('info', "app.js", 'Request: ' + req.method + ' ' + req.url + ' complete');
	next();
});

var httpServer;
var widgets_controller = require(global.rootPath + '/controllers/common/widgets_controller.js');

require(global.rootPath + '/controllers/init_controller.js').init(
    function(err){
        if(err){
            process.exit(1);
        }else{
            // create http server
            httpServer = http.createServer(app).listen(app.get('port'), function(){
                logger.log('info','app.js','Express server listening on port ' + app.get('port'));
            });
            // init socket server
            widgets_controller.init_sockets(httpServer);
        }
    }
);

