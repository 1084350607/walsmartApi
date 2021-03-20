var express = require('express')
var router = express.Router()
var query =  require('../mysql/root')
var jwt = require('jsonwebtoken');

// 生成token
let secrect = "qwert"
function generateToken(id) {
  return jwt.sign({
            user_id:id,
          }, secrect);
}
router.post('/', async function(req, res){
    let sql = 'select * from user'
    let dbData = await query(sql)
    for(let i = 0; i < dbData.length; i++) {
        if (dbData[i].username === req.body.username && dbData[i].password === req.body.password) {
            res.cookie('jwt',generateToken(dbData[i].id),{maxAge:30*60*1000})
            res.send({
                status: 'success',
                msg: '登录成功',
                data: Object.assign(dbData[i], {
                    password: ''
                })
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