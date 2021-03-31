var express = require('express')
let login = require('./router/login')
let register = require('./router/register')
let goods = require('./router/goods')
let cookieParser = require('cookie-parser')
var app = express()

// get post data 
const bodyParser = require('body-parser');
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods","*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use(cookieParser())
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

app.use('/login', login)
app.use('/register', register)
app.use('/goods', goods)

app.listen(3000)
