var express = require('express')
var consign = require('consign')

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

consign({ cwd: process.cwd() + "./app" })
    .include("controllers")
    .then("routes")
    .then("models")
    .then("./config/db.js")
    .into(app)

module.exports = app