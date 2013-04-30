function DB(){
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log("Database connected");
	  
	});
}

function DB.prototype.User = function () {

	var UserSchema = mongoose.Schema({
    	name: String
    	password: String
	})
	var UserModel = mongoose.model('User', UserSchema);
}

function DB.prototype.saveUser = function (user){
	var user = new UserModel(user);
	user.save(function (err,user){
		if(err)
			console.log('Error saving user');
	});
}

function DB.prototype.findUser = function (pass){
	UserModel.find({password: /pass/},function (err, user) {
		if(err)
			console.log('Error saving User');
		return user
	});
}
