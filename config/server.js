var express = require('express')
var consign = require('consign')

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

consign({ cwd: 'app' })
    .include("services")
    .then("controllers")
    .then("models")
    .then("routes")    
    .into(app)

module.exports = app