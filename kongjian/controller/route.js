/**
 * Created by Administrator on 2017/7/4.
 */
var opeardb = require("./operadb.js");
var foridable = require("formidable");
var file = require("../model/file.js");
var object = require("mongodb").ObjectID;
var md5 = require("./md5.js");
var path = require("path");
var fs = require("fs");
var silldatetime = require("silly-datetime");
exports.showIndex = function (req, res, next) {
  var uname=req.session.login=="1"?req.session.username:"";
  var login = req.session.login =="1"?true:false;
  opeardb.findone("introl",uname,function(err,result){
      if (err) {
          console.log("查询错误！") ;
          return;
      }
      if (result) {
          var message=result;
           console.log(message);
          opeardb.finddata("shuoshuo", uname, [3, 0], function (err, doc) {

                  res.render("index",{
                      "username":uname,
                      "login":login,
                      "active":"首页",
                      "message":result,
                      "shuoshuo":doc
                  })
              })
          }
      })
}
exports.showRegister = function (req, res, next) {
    res.render("register",{
        "username":req.session.login =="1"?req.session.username:"",
        "login":req.session.login =="1"?true:false,
        "active":"注册"
    })
}
exports.doRegister = function (req, res, next) {
    var form = new foridable.IncomingForm();
    var nowtime=silldatetime.format(new Date(),"YYYY-MM-DD：HH/mm/ss");
    form.parse(req, function (err, fields) {
        var username = fields.uname;
        var password = fields.upass;
        //要对用户这次输入的密码，进行相同的加密操作。然后与数据库中的密码进行比对
        password = md5(md5(password) + "cxq");
        var introl = fields.intro;
        var json = {
            "uname": username,
            "upass": password,
            "intro": introl,
            "rtime": nowtime
        }
            //比对数据库，按登录名检索数据库，查看密码是否匹配
            opeardb.finddata("message",username, function (err, result) {
                if (err) {
                    res.send("-3");
                    return;
                }
                if (result.length != 0) {
                    res.send("-1");
                    return;
                } else {
                    req.session.login = "1";
                    req.session.username = username;
                    opeardb.insertdata("introl", json, function (err, doc) {
                        if (err) {
                            res.send("-2");
                        }
                        res.send("1");
                    })
                }
            })


    })
}
exports.shuoshuo=function (req,res,next) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    var count=0;
    if(req.params.count){
       count=req.params.count;
    }
    var size=2;
    var array=[size,count];
    var prepage=0;
    var nextpage=0;
    if(count){
        prepage=count-1;
        prepage=prepage>-1?prepage:0;
        nextpage=parseInt(count)+1;
    }
    opeardb.finddata("shuoshuo",username,array,function (err,doc,counts) {
        var pagecount=Math.ceil(counts/size);
        if(err){
            console.log("1"+err);
            return;
            next();
        }
        nextpage=nextpage>=pagecount-1?pagecount-1:nextpage;
        res.render("shuo",{
            "username":req.session.login =="1"?req.session.username:"",
            "login":req.session.login =="1"?true:false,
            "active":"说说",
            "shuodata":doc,
            "counts":counts,
            "pagecounts":pagecount,
            "prepage":prepage,
            "nextpage":nextpage
        })
    })
}
exports.showLogin=function (req,res,next) {
    res.render("login",{
        "username":req.session.login =="1"?req.session.username:"",
        "login":req.session.login =="1"?true:false,
        "active":"登录"
    })
}
exports.doLogin=function (req,res,next) {
    var form = new foridable.IncomingForm();
    form.parse(req, function(err, fields) {
        var username = fields.uname;
        var password = fields.upass;
        //要对用户这次输入的密码，进行相同的加密操作。然后与数据库中的密码进行比对
        password = md5(md5(password)+"cxq");
        //比对数据库，按登录名检索数据库，查看密码是否匹配
        opeardb.findone("introl",username,function(err,result){
            if(result.length == 0){
                res.send("-1");
                return;
            }
            if(password == result[0].upass){
                req.session.login = "1" ;
                req.session.username = username;
                res.send("1");
                return;
            }else{
                res.send("-2");
                return;
            }
        });
    });
}
exports.doShuo=function (req,res,next) {
   var usename=req.session.username;
    var nowtime=silldatetime.format(new Date(),"YYYY-MM-DD：HH/mm/ss");
   var form=new foridable.IncomingForm();
   form.parse(req,function (err,fields) {
       var content=fields.content;
       var json={
           "uname":usename,
           "content":content,
           "uptime":nowtime
       }
       if(usename){
           opeardb.insertdata("shuoshuo",json,function (err,doc) {
               if (err) {
                   res.send("-1");
               }
               res.send("1");
           })
       }
   })
}