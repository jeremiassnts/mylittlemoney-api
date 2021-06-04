var express = require('express')
var consign = require('consign')

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

consign({ cwd: process.cwd() + "/app" })
    .include("./app/controllers")
    .then("./app/routes")
    .then("./app/models")
    .then("./config/db.js")
    .into(app)

module.exports = app