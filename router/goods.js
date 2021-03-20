var express = require("express");
var router = express.Router();
var query = require("../mysql/root");
let jwt = require("jsonwebtoken");
let secrect = "qwert";
router.get("/get_all", async function (req, res) {
  let result = null;
  try {
    let sql = "select * from goods_info";
    result = await query(sql);
    // console.log(result)
  } catch (error) {
    console.log(error)
    res.send({ status: "error", msg: "查询失败" });
  }
  res.send({ status: "success", msg: "查询成功", data: result });
});
router.get("/get_goods_by_category", async (req, res) => {
  const { category } = req.query;
  let sql = "select * from goods_info where category=?";
  let result = null;
  try {
    result = await query(sql, category);
    if (result.length === 0) {
      res.send({
        status: "error",
        msg: "没有这个分类",
      });
      return;
    }
    // console.log(result)
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "查询失败" });
  }
  res.send({ status: "success", msg: "查询成功", data: result });
});

//通过商品id查询商品信息
router.get("/get_goods_by_id", async (req, res) => {
  let user_id = req.cookies.jwt && jwt.verify(req.cookies.jwt,secrect).user_id
  const { id } = req.query;
  console.log(id)
  let sql = "select * from goods_info where id=?";
  let sql1 = "select * from shopping_car where user_id =? and goods_id=?"
  let result = null;
  try {
    result = await query(sql, id);
    if(user_id){
        let res = await query(sql1,[user_id,id])
        res.length===0?result[0].isCollect=false:result[0].isCollect = true
    }
    if (result.length === 0) {
      res.send({
        status: "error",
        msg: "商品已经被删除",
      });
      return;
    }
    // console.log(result)
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "查询失败" });
  }
  res.send({ status: "success", msg: "查询成功", data: result[0] });
});

//通过用户id查询加入购物车的东西
router.get("/get_collect_by_id", async (req, res) => {
    const jwtString = req.cookies.jwt
    let id ;
    if(jwtString){
       id = jwt.verify(jwtString,secrect).user_id
    }else{
        res.send({status:301,msg:'登陆失效，重新登陆'})
        return 
    }
//   const { id } = req.query;
  let sql = "select * from shopping_car where user_id = ?";
  let result = null;
  try {
    result = await query(sql, id);
    result = result.reduce((pre, next) => {
      pre.push(next.goods_id);
      return pre;
    }, []);
    // console.log(result);
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "查询失败" });
  }
  res.send({ status: "success", msg: "查询成功", data: result });
});

async function collect(gid, uid) {
  let sql = "insert into shopping_car (goods_id,user_id) values (?,?)";
  let result = await query(sql, [gid, uid]);
  return result;
}
async function canelCollect(gid, uid) {
  let sql = "delete from shopping_car where goods_id =? and user_id =?";
  let result = await query(sql, [gid, uid]);
  return result;
}

router.post("/collect", async (req, res) => {
    const jwtString = req.cookies.jwt
    let user_id ;
    if(jwtString){
        user_id = jwt.verify(jwtString,secrect).user_id
    }else{
        res.send({status:301,msg:'登陆失效，重新登陆'})
        reuturn 
    }
  const {  goods_id } = req.body;
  //查询购物车里有没有添加过
  let sql = "select * from shopping_car where user_id=? and goods_id =?";
  let result = null;
  try {
    result = await query(sql, [user_id, goods_id]);
    if (result.length) {
      //添加过了取消收藏
      result = canelCollect(goods_id, user_id);
      res.send({ status: "success", msg: "取消收藏成功",data:false });
      return;
    }
    //没有添加过取消收藏
    result = collect(goods_id, user_id);
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "收藏失败" });
  }
  res.send({ status: "success", msg: "收藏成功",data:true });
});
module.exports = router;
