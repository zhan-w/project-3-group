// Depedencies
var express = require('express');
var http = require('http');
var bodyParser = require ('body-parser');
var db = require('./models');

//  Express
var app = express();
var router = express.Router();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//  Views / File system(?)
app.set('views', './views');
app.set('view engine', 'ejs');

//  Start Server
var server = http.createServer(app);
server.listen(process.env.PORT || 3000);

//  Routes
app.get('/', function (req, res){
 // console.log(req.query);
 res.render('index');

});

// ROUTE Routes
// Routes Index Path
app.get("/routes", function (req, res){
  db.Route.find({}, function (err, routes){
    // console.log(routes);
    res.send(routes)
 });
});

app.get("/routes/:id/edit", function (req, res) {
  console.log(req.params.id);
  db.Route.findById(req.params.id, function (err, route){
    // console.log(route);
    res.render('edit', {route:route})
 });
});

// display the route entered in the form
app.post("/route", function (req, res){
	db.Route.findOne({start: req.body.origin, end: req.body.destination}, function (err, route) {
			res.send(route);
	});
});

// from api
app.post("/routes/:id/update", function (req, res) {
  console.log(req.params.id);
  db.Route.findById(req.params.id, function (err, route){
    // console.log(route);
    res.render('edit', {route:route})
 });
});

// Routes Post Path from api
app.post("/routes/new", function (req, res){
  db.Route.create(req.body, function(err, routes){
  });
  var newRoute = req.body;
  routes.length >= 1 ? newRoute.id = routes[routes.length -1].id +1 : newRoute.id = 0;
  routes.push(newRoute);
  res.send(JSON.stringify(newRoute));
  // I think maybe this is creating a url with 2 params because it is being created with only 2 params.?  Would it make a different url if it had more?
});

// PLACES ROUTES
// Places Index Path
app.get("/places", function (req, res){
	// console.log(req.params.id);
  db.Place.find({}, function (err, places){
    if(err)
      console.log(error)
  res.render('places')
 });
});

// display markers belong to the same route places.js
app.get("/api/routes/:id/places", function (req, res){
	debugger;
  db.Route.find({_id: req.params.id}, function (err, route){
  	res.send(route[0].places);
  	// console.log(route[0].places);
 });
});

app.post("/api/routes/:id/places", function (req, res){
	db.Route.find({_id: req.params.id}, function(err, route) {
		db.Place.create({longitude: req.body.lng, latitude: req.body.lat}, function(err, place){
			route[0].places.push(place);
			route[0].save();
		});
	});
});

// // Comments Routes

// // Create a new route with the prefix /comment
// var commentsRoute = router.route('/comments');

// // Create endpoint /api/beers for POSTS
// commentsRoute.post(function(req, res) {
//   // Create a new instance of the Beer model
//   var comment = new Comment();

//   // Set the beer properties that came from the POST data
//   comment.username = req.body.name;
//   comment.body = req.body.type;
//   comment.createdtime = req.body.quantity;



