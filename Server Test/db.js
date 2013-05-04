function DB(){
	this.mongoose = require('mongoose');
	//this.bcrypt = require('bcrypt');
	this.mongoose.connect('mongodb://localhost/test');

	var db = this.mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log("Database connected");
	  
	});
}

DB.prototype.User = function () {

	 this.UserSchema = this.mongoose.Schema({
    	username: { type: String, required: true, index: { unique: true } },
    	password: { type: String, required: true }
	})
	this.UserModel = this.mongoose.model('User', this.UserSchema);

	this.UserSchema.methods.comparePassword = function(candidatePassword, cb) {
		if(this.password == candidatePassword){
			cb(null,true);
		}else{
			cb(null,false);
		}
	};

}

DB.prototype.saveUser = function (user){
	var user = new this.UserModel(user);
	user.save(function (err,user){
		if(err)
			console.log('Error saving user');

		//console.log('user saved');
		//console.log(user);
	});
}

DB.prototype.findUser = function (username, cb){
	//var doc = "";
	console.log(cb);
	var query = this.UserModel.findOne({ 'username': username });
	query.exec(cb);
	/*this.UserModel.findOne({ 'username': username }, function (err,user){
		if(err) console.log('Error finding');
		doc = user;
		console.log(doc);
	});*/
	//console.log('Doc finded');
	//console.log(doc);
	//return doc;
}



exports.createDB = function(){
	return new DB();
}

exports.createUser = function(){
	return User();
}