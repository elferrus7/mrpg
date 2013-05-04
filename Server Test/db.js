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

DB.prototype.saveUser = function (u){
	var usuario = new this.UserModel(u);

	usuario.save(function (err,user){
		if(err) console.log('Error saving user');
	});
}

DB.prototype.findUser = function (username){
	var doc = false;
	this.UserModel.findOne({'username':'milu' }, function(err, user){
		if(user != null){
			doc = true;
		}
		console.log("ADENTRO: "+doc);

	return doc;
	});
	console.log("afuera: "+doc);
}


exports.createDB = function(){
	return new DB();
}

exports.createUser = function(){
	return User();
}