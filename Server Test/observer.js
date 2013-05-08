/* The interfaze of the Grid Client
	send the notify to the observer
*/
function Grid(observer){
	var observer = observer;
}

Grid.prototype.notify = function(){
	this.observer.warning();
}



//Receive and send the json to the observer
function GridClient(id,socket){
	/*
	1-Por medio de un post recive el JSON de que existe una actulizacio
	2-GridClient Notifica por medio de Grid al observer que existe una actualización
	3-El observer avisa a cada uno de los Grid que existe una actualización
	4-El Grid obtiene el JSON y se lo pasa a GridClients 
	5-GridClient notifica al cliente que existe un nuevo JSON
	6-El mobile Grid obtiene el json
	7-El mobile Grid actualiza en la interfaz los cambios
	*/
	this.socket = socket;
	this.id = id;
}

GridClient.prototype.sendJson = function(socket, jason, room){
	socket.broadcast.to(room).emit('updateGrid', jason);
}

exports.createGridClient = function(id,socket){
	gcl = new GridClient(id,socket);
	g = new Grid();
	gcl.prototype = g.prototype;
	return gcl;
}

//Observer Define la interfaz de actualización para los objetos que 
//deben ser informados de los cambios de un sujeto.
function Observer(){
	this.grids = new Array();
}

exports.getInstance = function(){
	return new Observer();
}

Observer.prototype.addGrid = function(grid){
		this.grids.push(grid);
}

Observer.prototype.removeGrid = function(id){

}

Observer.prototype.warning = function(socket,jason,room){
	for(var i = 0; i < this.grids.length; i++){
		if(this.grids[i].socket != socket){
			this.grids[i].sendJson(socket, jason, room);
		}
	}
}
