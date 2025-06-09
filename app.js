var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var jwt = require('jsonwebtoken')
var multer = require('multer')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { PythonShell } = require("python-shell");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products') 
var cartRouter = require('./routes/cartProducts')
var orderRouter = require('./routes/orderProducts')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));
app.use('/productPictures', express.static(path.join(__dirname, 'routes/productPictures')));
app.use('/users', usersRouter);
app.use('/products',productRouter);
app.use('/cart',cartRouter)
app.use('/orders',orderRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Ecommerce')

const db = mongoose.connection;

db.once('open',()=>{
    console.log("Connect to mongodb")
})

module.exports = app;
