var express = require('express')
var consign = require('consign')

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

consign({ cwd: 'app' })
    .include("controllers")
    .then("routes")
    .then("models")
    .then("database")
    .into(app)

module.exports = app