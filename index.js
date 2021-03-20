var express = require('express')
let login = require('./router/login')
let register = require('./router/register')
let goods = require('./router/goods')
var app = express()

// post 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))

app.use('/login', login)
app.use('/register', register)
app.use('/goods', goods)

app.listen(3000)
