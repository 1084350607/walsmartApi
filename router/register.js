var express = require('express')
const { password } = require('../mysql/config')
var router = express.Router()
var query =  require('../mysql/root')


router.get('/', async function (req, res) {
    res.send({
        msg:"Can't get ./register"
    })
})

router.post('/', async function (req, res) {
    try{
        let sql = 'select username from user'
        let dbData = await query(sql)
        let flag = false
        dbData.forEach(item => {
            if (item.username === req.body.username) {
                flag = true
                res.send({
                    status: 'error',
                    msg: '用户名已经注册，请直接登录'
                })
            }
        })
        if (!flag) {
            await insertUser(req.body.username, req.body.password)
            res.send({
                status: 'success',
                msg: '注册成功'
            })
        }
    } catch (e) {
        console.log(e)
        res.send({
            status: 'error',
            msg: '注册失败'
        })
    }

})

const insertUser = async (uname, psw) => {
    if (uname && psw) {
        let sql = `insert into user (username, password) values (?, ?)`
        let values = [uname, psw]
        await query(sql, values)
    }
}


module.exports = router