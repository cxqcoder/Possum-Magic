/**
 * Created by Administrator on 2017/6/30.
 */
var MongoClient=require("mongodb").MongoClient;
var dbUrl = require("./setUrl.js");
var url = dbUrl.url;
function collectdb(callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, db)
    })
}
exports.insertdata=function (collectionName,json,callback) {
     collectdb(function (err,db) {
         db.collection(collectionName).insertOne(json,function (err,result) {
             if (err) {
                 callback(err, null);
                 return;
             }
             callback(null, result);
             db.close();
         })
     })
}
exports.findone=function () {
    var collectionName = arguments[0];
    var uname={
        "uname":null
    };
    var callback = null;
    if (arguments.length == 2) {
        callback = arguments[1];
    } else if (arguments.length == 3) {
        uname.uname=arguments[1];
        callback = arguments[2];
    }
    else {
        console.log("参数个数错误！");
    }

    collectdb(function (err,db) {
        var cursor;
        if(uname==null){
            cursor= db.collection(collectionName).find();
        }else{
            cursor= db.collection(collectionName).find(uname);
        }
        var result=[];
        cursor.each(function (err, dir) {
            if(err){
                callback(err,null);
                console.log("查询出错！");
                return;
            }
            if (dir != null) {
                result.push(dir);
            } else {
                callback(null, result);
                db.close();
            }
        })
    })
}
exports.finddata=function () {
    var collectionName = arguments[0];
    var uname=null;
    var args ={
        "pagesize":0,
        "pagecount":0
    };
    var callback = null;
    if (arguments.length == 2) {
        callback = arguments[1];
    } else if (arguments.length == 3) {
       if(Array.isArray(arguments[2])){

           args.pagesize=arguments[1][0];
           args.pagecount=arguments[1][1];
           callback = arguments[2];
       }else {
           uname=arguments[1].username;
           callback = arguments[2];
       }
    } else  if(arguments.length == 4){
        uname=arguments[1]
        args.pagesize=arguments[2][0];
        args.pagecount=arguments[2][1];
        callback=arguments[3];
    }
    else {
        console.log("参数个数错误！");
    }
    var json={
        "uname":uname
    }
    console.log(json);
    collectdb(function (err, db) {
        db.collection(collectionName).find(json).count({}).then(function (count) {
            counts = count;
        })
        var cursor;
        if(uname==null){
            console.log("11");
            cursor= db.collection(collectionName).find().limit(args.pagesize).skip(args.pagesize*args.pagecount);
        }else{
            console.log("22");
            cursor= db.collection(collectionName).find(json).limit(args.pagesize).skip(args.pagesize*args.pagecount);
        }
        var result=[];
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null, null);
                return;
            }
            if (doc != null) {
                result.push(doc);
            } else {
                callback(null, result, counts);
                db.close();
            }
        })

    })
}
exports.showpho=function (collectionName,name,callback) {
    var args ={
        "name":name
    };
    collectdb(function (err,db) {
        var cursor= db.collection(collectionName).find(args);
        var result=[];
        cursor.each(function (err, dir) {
            if(err){
                callback(err,null);
                console.log("查询出错！");
                return;
            }
            if (dir != null) {
                result.push(dir);
            } else {
                callback(null, result);
                db.close();
            }
        })
    })
}
exports.updatefm=function (collectionName,oJson,nJosn,callback) {
    collectdb(function (err,db) {
        db.collection(collectionName).updateMany(oJson,nJosn,function (err,result) {
            if(err){
                callback(err,null);
                console.log(err);
                return;
            }
            callback(null,result);
            db.close();
        })
    })
}
exports.deleteMany= function(collectionName,json,callback){
    collectdb(function(err,db){
        db.collection(collectionName).deleteMany(json,function(err,rusult){
            if(err){
                callback(err,null);
                return;
            }
            callback(null,rusult);
            db.close();
        })
    })
}