var User = require('../models/user');
var passport = require("passport");
var fs = require('fs');
var path = require('path');

exports.signup = function(req,res, next){
    User.findOne({username:req.body.username}, function(err, data){
        if(data==null){
            var newUser = new User();
            newUser.username = req.body.username;
            newUser.password = req.body.password;
            newUser.email = req.body.email;
            newUser.save(function(err, result){
                if(err) console.log(err);
                passport.authenticate('local', {failureRedirect: '/login' })(req,res, next);
            });
        }else{
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.send(200, 'http://127.0.0.1:3000/');
        }
    })
};

exports.deleteUser = function(userId, res){

//  User.findByIdAndRemove();
    User.findById( userId, function (err, doc) {
        if (err) return err
        if(doc==null){
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.send(204);
        }else{
            doc.remove(function(){
                res.set('Access-Control-Allow-Origin', '*');
                res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
                res.send(200, 'http://127.0.0.1:3000/');
            });
        }
    })
};

exports.upload = function(req,res){
    //    console.log('file: %j', req.files.model);
    var model = req.files.model;
    var is = fs.createReadStream(model.path);
    var os = GLOBAL.gfs.createWriteStream({filename: model.name, metadata: {username: req.user.username}});
//    console.log(req.files.model);
    is.pipe(os);
    os.on('close', function(file){
        console.log(file.filename);
    });
    is.on('end',function() {
        fs.unlinkSync(model.path);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.send(200, 'http://127.0.0.1:3000/');
    });
}

exports.showAll= function(req,res,next){
    var readStream = GLOBAL.gfs.createReadStream({filename:'tucan.png'});
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//    res.set('Content-Type', 'image/png');
//    res.set('Content-Transfer-Encoding', 'base64');
    readStream.pipe(res);
//    var file = '';
//    readStream.on('data', function(chunk){
//        file = file+chunk;
//    });
//    readStream.on('end', function(){
//        file.replace("/", '');
//        var image = new Buffer(file.toString(), "binary").toString('base64');
//        res.set('Access-Control-Allow-Origin', '*');
//        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//        image = "data:image/png;base64,"+image;
//        res.send("<img src=\""+ image +"\"/>");
//    });
};

//TODO-me jednakowe cudzysłów
//todo-me enable flash messages
//todo-me manage error
//TODO-me only realtive paths
