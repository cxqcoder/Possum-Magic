/**
 * Created by Administrator on 2017/6/27.
 */
var fs=require("fs");
exports.makedir=function (path,quxian,callback) {
    fs.exists(path,function (exists) {
        if(exists){
            console.log("相册已存在，请重新创建！")
        }else {
            fs.mkdir(path,quxian,function (err) {
                if(err){
                    callback(err);
                }
                callback(null);
                console.log("创建目录成功！");
            })
        }
    })

}
exports.delete=function (path,callback) {
   fs.rmdir(path,function (err) {
       if(err){
           callback(err);
       }
       callback(null);
   })
}
exports.rename=function (oldpath,newpath,callback) {
    console.log(oldpath+newpath);
    fs.rename(oldpath,newpath,function (err) {
        if(err){
            callback(err);
            return;
        }
        callback(null);
    })
}
exports.getDir=function (callback) {
    var dirname=[];
    fs.readdir("./upload",function (err,files) {

        (function iterator(i) {
            if(i==files.length){
                callback(dirname);
                return;
            }
            fs.stat("./upload/"+files[i],function (err,stat) {
                if(stat.isDirectory()){
                    dirname.push(files[i]);
                }
                iterator(i+1);
            })
        })(0)
    })
}
exports.getPhoto=function (photoname,callback,next) {
    var ptotos=[];
    fs.readdir("./upload/"+photoname,function (err,files) {
        if(err){
            next();
            return;
        }
        (function iterator(i) {
            if(i==files.length){
                callback(ptotos);
                return;
            }
            fs.stat("./upload/"+photoname+"/"+files[i],function (err,stat) {
                if(stat.isFile()){
                    ptotos.push(files[i]);
                }
                iterator(i+1);
            })
        })(0)
    })
}