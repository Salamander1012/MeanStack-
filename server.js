var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');

//APP CONFIGURATION ----------
//use body parser to grab info from POST requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//configure to handle CORS reqs
app.use(function(req, res, next) {
	res.setHeader('Acess-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
	next();
});

//log all requests to console

app.use(morgan('dev'));


//CONNECT TO DATABASE
mongoose.connect('mongodb://<Salamander1012>:<password>@apollo.modulusmongo.net:27017/iZosu2bi');

//ROUTES FOR API

//basic route for home page
app.get('/', function(req, res) {
	res.send('welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all reqs
apiRouter.use(function(req, res, next) {
	//do logging
	console.log('somebody just came to my app!');
	next();
});

//test route to make sure everything is working
apiRouter.get('/', function(req, res) {
	res.json({message: 'api working'});
});

//more routes for api
//routes that end in /user
apiRouter.route('/user')
	.post(function(req, res) {
		var user = new User();
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		user.save(function (err) {
			if (err) {
				if (err.code == 11000)
					return res.json({ success: false, message: 'a user with that username already exists'});
				else
					return res.send(err);
			}
				res.json({ message: 'user created!'});
		});
	});




//REGISTER ROUTES
//all routes will be prefixed with /api
app.use('/api', apiRouter);




//START SERVER
app.listen(port);
console.log('Magic happens on port ' + port);









