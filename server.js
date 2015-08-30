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
mongoose.connect('mongodb://salman:salman@ds035613.mongolab.com:35613/meandb');

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
apiRouter.route('/users')

	// create a user (accessed at POST http://localhost:8080/users)
	.post(function(req, res) {
		
		var user = new User();		// create a new instance of the User model
		user.name = req.body.name;  // set the users name (comes from the request)
		user.username = req.body.username;  // set the users username (comes from the request)
		user.password = req.body.password;  // set the users password (comes from the request)

		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000) 
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else 
					return res.send(err);
			}

			// return a message
			res.json({ message: 'User created!' });
		});

	})

	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) return res.send(err);

			// return the users
			res.json(users);
		});
	});

//routes that end in /users/:user_id

apiRouter.route('/users/:user_id')

// get the user by id
	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			res.json(user);
		})
	})
//update the user by id

	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;
			//save user
			user.save(function(err) {
				if (err) res.send(err);
			})

			res.json({message: 'User updated!'});
		})
	})

//delete user by id

	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) return res.send(err);
			res.json({message: 'Succesfully deleted!'});
		});
	}); 


//REGISTER ROUTES
//all routes will be prefixed with /api
app.use('/api', apiRouter);




//START SERVER
app.listen(port);
console.log('Magic happens on port ' + port);









