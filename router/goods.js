var express = require("express");
var router = express.Router();
var query = require("../mysql/root");

router.get("/get_all", async function (req, res) {
  let result = null;
  try {
    let sql = "select * from goods_info";
    result = await query(sql);
    // console.log(result)
  } catch (error) {
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
    // console.log(result)
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "查询失败" });
  }
  res.send({ status: "success", msg: "查询成功", data: result });
});
router.get("/get_goods_by_id", async (req, res) => {
  const { id } = req.query;
  let sql = "select * from goods_info where id=?";
  let result = null;
  try {
    result = await query(sql, id);
    // console.log(result)
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "查询失败" });
  }
  res.send({ status: "success", msg: "查询成功", data: result });
});

router.get("/get_collect_by_id", async (req, res) => {
  const { id } = req.query;
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
  const { user_id, goods_id } = req.body;
  //查询购物车里有没有添加过
  let sql = "select * from shopping_car where user_id=? and goods_id =?";
  let result = null;
  try {
    result = await query(sql, [user_id, goods_id]);
    if (result.length) {
        //添加过了取消收藏
      result = canelCollect(goods_id, user_id);
      res.send({ status: "success", msg: "取消收藏成功" });
      return;
    }
    //没有添加过取消收藏
    result = collect(goods_id, user_id);
    
  } catch (error) {
    console.log(error);
    res.send({ status: "error", msg: "收藏失败" });
  }
  res.send({ status: "success", msg: "收藏成功" });
});
module.exports = router;
