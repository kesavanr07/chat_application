var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
var cors            = require('cors');
var mongoose        = require('mongoose');

var config_mongo    = require('./config.json').mongo[process.env.NODE_ENV];
var indexRouter     = require('./routes/index');
var messagesRouter  = require('./routes/messages');

var app             = express();


// mongoose.connect(`mongodb://${config_mongo.host}:${config_mongo.port}/${config_mongo.database}`, { useFindAndModify: false, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(`mongodb+srv://${config_mongo.user}:${config_mongo.password}@${config_mongo.host}/${config_mongo.database}`, { useFindAndModify: false, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/api', indexRouter);
app.use('/api/messages', messagesRouter);

module.exports = app;




