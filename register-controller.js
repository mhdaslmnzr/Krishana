var Cryptr = require('cryptr');
var express=require("express");
var connection = require('/home/user/Desktop/lo/config');
// cryptr = new Cryptr('myTotalySecretKey');
 
module.exports.register=function(req,res){
  var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "email":req.body.username,
        "password":encryptedString
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
    });
}
