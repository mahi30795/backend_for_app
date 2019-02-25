var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var indexRouter = require('./routes/api');
const env = require('./config/env')

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    env.mongo,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected..."));

app.use('/', indexRouter);

// port setting
app.set("port", env.port);
app.listen(app.get("port"), () => {
  console.log(`Server started on port ` + app.get("port"));
});

module.exports = app;
