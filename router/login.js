var express = require('express')
var router = express.Router()
var query =  require('../mysql/root')

router.get('/', async function(req, res){
    let sql = 'select * from user'
    let result = await query(sql)
    res.send(result)
})

module.exports = router