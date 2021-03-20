var express = require('express')
var router = express.Router()
var query =  require('../mysql/root')

router.post('/', async function(req, res){
    let sql = 'select * from user'
    let dbData = await query(sql)

    for(let i = 0; i < dbData.length; i++) {
        if (dbData[i].username === req.body.username && dbData[i].password === req.body.password) {
            res.send({
                status: 'success',
                msg: '登录成功'
            })
            break
        }
        if (i === dbData.length - 1) {
            res.send({
                status: 'error',
                msg: '账号或密码错误'
            })
        }
    }
})

router.get('/', async function(req, res){
    res.send({
        msg:"Can't get ./login"
    })
})

module.exports = router