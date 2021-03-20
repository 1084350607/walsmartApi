var express = require('express')
var login = require('./router/login')

var app = express()
app.use('/login', login)

app.listen(3000)
