var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var jwt = require('jsonwebtoken')
var multer = require('multer')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products') 

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

app.use('/', indexRouter);
app.use('/uploads', express.static('uploads'));
app.use('/users', usersRouter);
app.use('/products',productRouter);



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

// const { MongoClient } = require('mongodb')
// const client = new MongoClient('mongodb://localhost:27017/')

// app.post("/users/create",async (req,res)=>{
//   await createUser(req.body)
//   res.status(200).send("user created successfully")
// })

// async function authorization(req, res, next){
//   const token = req.headers.authorization;
//   jwt.verify(token,"hello-world",(error,data)=>{
//     if(error){
//       return res.status(403).send("user is not authorized")
//     }
//     req.user = data
//     next()
//   })
// }


module.exports = app;
