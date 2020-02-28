var express=require("express");
var bodyParser=require('body-parser');
 
var connection = require('/home/user/Desktop/lo/config');
var app = express();
 
var authenticateController=require('/home/user/Desktop/lo/authenticate-controller');
var registerController=require('/home/user/Desktop/lo/register-controller');
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})  
 
app.get('/log.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "log.html" );  
})  
 
/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/home/user/Desktop/lo/register-controller', registerController.register);
app.post('/home/user/Desktop/lo/authenticate-controller', authenticateController.authenticate);
app.listen(8012);
