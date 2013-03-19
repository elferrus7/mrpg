// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(err) { return console.dir(err); }
	  console.log("My body is ready \n");
	  var collection = db.collection('users');
	  var docs = [{first_name:"Fernando"}, {last_name:"Mendoza"}, {birthday:"01/30/1989"}];

	  collection.insert(docs, {w:1}, function(err, result) {

	  collection.find().toArray(function(err, items) {
	  	console.log(items + "\n");
	  });

	  var stream = collection.find({mykey:{$ne:2}}).stream();
	  stream.on("data", function(item) {});
	  stream.on("end", function() {});

	  collection.findOne({mykey:1}, function(err, item) {});

  });

});