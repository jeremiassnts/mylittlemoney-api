var express = require('express')
var consign = require('consign')

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "OPTIONS, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Header");
  res.header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS")
  next();
});

consign({ cwd: 'app' })
  .include("services")
  .then("controllers")
  .then("models")
  .then("routes")
  .into(app)

module.exports = app