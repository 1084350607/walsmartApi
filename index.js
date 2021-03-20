var express = require('express')
let login = require('./router/login')
let register = require('./router/register')
let goods = require('./router/goods')
var app = express()

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// get post data 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))

app.use('/login', login)
app.use('/register', register)
app.use('/goods', goods)

app.listen(3000)
