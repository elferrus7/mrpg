//main.js

function Main(){
	this.x = 0;
	alert('Main started');
	Main.prototype.sayHellow = function() {
	console.log("Helow from main \n");
	};
}

exports.sayHellow = function() {
	console.log("Helow from main \n");
	};