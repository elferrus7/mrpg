function DB(){
	this.mongoose = require('mongoose');
	this.mongoose.connect('mongodb://localhost/test');

	var db = this.mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log("Database connected");
	  
	});
}

DB.prototype.User = function () {

	 this.UserSchema = this.mongoose.Schema({
    	username: String,
    	password: String
	})
	this.UserModel = this.mongoose.model('User', this.UserSchema);
}

DB.prototype.saveUser = function (user){
	var user = new this.UserModel(user);
	user.save(function (err,user){
		if(err)
			console.log('Error saving user');
	});
}

DB.prototype.findUser = function (username){
	console.log("usuario: "+username);
	var query = this.UserModel.findOne({ username: /^username/ });
	query.select('username');
	query.exec( function (err,user){
		console.log(user);
		if (err) return null
		
		return user.username;
	});
}


exports.createDB = function(){
	return new DB();
}

exports.createUser = function(){
	return User();
}