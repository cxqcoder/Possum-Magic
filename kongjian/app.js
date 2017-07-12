var express = require("express");
var session = require('express-session');
var route = require("./controller");

var app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


app.set("view engine","ejs");
app.use(express.static("./public"));
app.get("/",route.showIndex);
app.get("/regedit",route.showRegister);
 app.post("/dshuo",route.doShuo);
app.post("/doRegedit",route.doRegister);
app.get("/login",route.showLogin);
app.post("/doLogin",route.doLogin);
app.get("/shuoshuo",route.shuoshuo);
app.get("/page:count",route.shuoshuo);
// app.post("/post",route.doPost);

app.listen(3500);