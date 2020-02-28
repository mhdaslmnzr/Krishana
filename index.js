//Dependencies=============================

var express=require("express");
var bodyParser=require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
var path = require('path');
//=========================================
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'user1',
   password : 'user1',
   database : 'mydb'
});

var app = express();
app.use(express.static('public'));

app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var authenticateController=function(req,res){
   var email=req.body.email;
   var password=req.body.password;
   
   connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
         res.json({
           status:false,
           message:'there are some error with query'
           })
     }else{
      
       if(results.length >0){
 decryptedString = cryptr.decrypt(results[0].password);
           if(password==decryptedString){
               res.json({
                   status:true,
                   message:'successfully authenticated'
               })
           }else{
               res.json({
                 status:false,
                 message:"Email and password does not match"
                });
           }
         
       }
       else{
         res.json({
             status:false,    
           message:"Email does not exits"
         });
       }
     }
   });
};
var registerController=function(req,res){
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
 
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//||||||||||||=======--ROUTES--========||||||||||||||

//Root=========================================
app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})  
//Log=========================================
app.get('/log.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "log.html" );  
})  
 
/* route to handle login and registration */
app.post('/api/register',registerController);
app.post('/api/authenticate',authenticateController);
 

app.post('/register-controller', registerController);
app.post('/authenticate-controller', authenticateController);


//Login=========================================

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/lo.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter username and Password!');
		response.end();
	}
});
//Home=========================================
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
//Register=========================================
app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/regauth', function(request, response) 
{
       var users={
	"username":request.body.username,
	"password":request.body.password
        }
         connection.query('INSERT INTO accounts SET?',users, function(error, results, fields) {
	    if (error) {
				
        response.send({
            status:false,
            message:'there are some error with query'
        })
			} 
     else {
				response.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
          
        })
        //response.redirect('/home');
		}			
	//		response.end();
		});
	
});
//=========================================

app.listen(8000);
console.log("Your app is running in localhost:8000");