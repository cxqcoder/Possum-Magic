var express = require('express');
var formidable = require('formidable');
var operadb = require("./operadb.js");
var md5 = require("./md5.js");
var sillydatetime=require("silly-datetime");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

});
router.get('/register', function(req, res, next) {
    res.render("register")

});
router.post("/doregister",function (req,res,next) {
    var fom=new formidable.IncomingForm();
    var rtime=sillydatetime.format(new Date(),"YYYY-MM-DD HH:mm:ss");
    fom.parse(req,function (err,fields,files) {
        console.log(files);
        var username = fields.username;
        var password = fields.password;
        var introl=fields.intro;
        var tx=fields.tx;
        console.log(username);
        //要对用户这次输入的密码，进行相同的加密操作。然后与数据库中的密码进行比对
        password = md5(md5(password)+"cxq");
        //比对数据库，按登录名检索数据库，查看密码是否匹配
        operadb.finddata("message",{"uname":username},function (err,result) {
            if(err){
                res.send("-3");
                return;
            }
            if(result.length != 0){
                res.send("-1");
                return;
            }else{
                req.session.login = "1" ;
                req.session.username = username;
                operaDb.insertdata("message",{
                    "uname":username,
                    "upass":password,
                    "intro":introl,
                    "tx":tx,
                    "rtime":rtime
                },function(err,result){
                    res.send("1");
                })
            }
        })
    })
})
module.exports = router;
