/*
This class is for the display and manipulation of the grid in the game
here we gone a handle all the related with the grid, events, images and
representation of the game.
*/

function Grid(r, c, background){
	console.log("Grid initialized");
	this.paper = Raphael("grid", 600, 300); // This part is static right now but we have to configurate later
	cells = this.paper.set(); // All the cells
	characters = this.paper.set(); // All the images of the avatars thar represent the player and other NPC's
	this.background = this.paper.image(background,0,0,500,300); // config
	this.background_src = background;
	rows = r; //Number of colums 
	colums = c; // Number of rows
	flag = false; //Flag for the movement of the characters
	jason = new Array(); //Json to send the information of the grid to the server
	charid = 0; //Charid that is being clicked to change to another cell
	this.createCells(); //Create the cells for the game
}

Grid.prototype.addCharacter = function(src,cellid)
{
	id = characters.length;
	characters.push(this.paper.image(src, 5, 5, 40, 40)
								   .data("id", id)
								   .click(function(){
										flag = true;
										charid = this.data("id");
										//console.log("you clicked " + flag + " " + charid);
									})
	);
	//string = "t" + (Math.floor(cellid / rows)) * 50 + "," // Calculando el numero de columnas de la posicion de la celda
						// + (cellid - (Math.floor(cellid / rows)) * rows ) * 50;
	//console.log("Transforming to " + string);
	//characters[characters.length -1].transform(string);
	jason.push({id:id,cell:cellid,src:src});
	//console.log(jason);
	this.moveImage(id,cellid);
	//console.log("Character added in " + 5 + (Math.floor(cellid / rows)) * 55 + " , " + 5 + (cellid - (Math.floor(cellid / rows)) * rows ) * 55);
	/*this.characters.click(function(){
		console.log("you clicked " + this.data("id"));
	});*/
};

/*
Esta función es llamada cuando se realiza un movimiento por parte de otro jugador
*/

Grid.prototype.moveImage = function(charId,cellId){

	string = "t" + (Math.floor(cellId / rows)) * 50 + "," // Calculando el numero de columnas de la posicion de la celda
				 + (cellId - (Math.floor(cellId / rows)) * rows ) * 50; // Calculando Numero de fila de la posición de la celda
	characters[charId].transform(string);
	jason[charId].cell = cellId;
}

Grid.prototype.updateGrid = function(sjason){
	ljason = JSON.parse(sjason);
	for(var i in ljason){
		if(ljason[i].id != null){
			this.moveImage(ljason[i].id, ljason[i].cell);	
		}
	}
}

Grid.prototype.returnJson= function(){
	jason.push({background: this.background_src }); //Set the background

	return jason;
}

Grid.prototype.setBackground = function(background){
	this.background.remove();
	this.background_src = background;
	this.background = this.paper.image(background,0,0,500,300);
}

Grid.prototype.createCells = function(){
	//Creating the cells
	id = 0; //Id for the cells
	for (var i = 0 ; i < colums; i++) {
		for (var j = 0; j < rows; j++) {
			cells.push(this.paper.rect(i * 50, j * 50, 50, 50)
									  .data("id",id++)
				);
		};
	};
	cells.attr({fill: "#000", "fill-opacity": 0}); // With this property we can click in the square
	cells.click(function(){
		if(flag){
			Grid.prototype.moveImage(charid,this.data("id"));
			flag = false;
		} else {
		}
	});
}

Grid.prototype.getCells = function(){
	return cells;
}