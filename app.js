var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var controller = require('./src/controller');
const fileUpload = require('express-fileupload');

var app = express();

app.use(express.json());

//lib middleware
app.use(cors());
app.use(fileUpload());
app.use(logger('dev'));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(controller);

module.exports = app;
