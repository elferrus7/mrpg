/*
This class is for the display and manipulation of the grid in the game
here we gone a handle all the related with the grid, events, images and
representation of the game.
*/

function Grid(rows, colums, background){
	console.log("Grid initialized");
	this.paper = Raphael(70, 0, 600, 600); // This part is static right now but we have to configurate later
	this.cells = this.paper.set(); // All the cells
	characters = this.paper.set(); // All the images of the avatars thar represent the player and other NPC's
	this.background = this.paper.image(background,0,0,500,300); // config
	this.rows = rows; //Number of colums 
	this.colums = colums; // Number of rows
	id = 0; //Id for the cells
	flag = false; //Flag for the movement of the characters
	charid = 0;
	//Creating the cells
	//console.log("Painting grid from rows " + rows + "colums" + colums);
	for (var i = 0 ; i < colums; i++) {
		for (var j = 0; j < rows; j++) {
			//console.log("Painting cell " + i + " " + j);
			this.cells.push(this.paper.rect(i * 50, j * 50, 50, 50)
									  .data("id",id++)
				);
		};
	};
	this.cells.attr({fill: "#000", "fill-opacity": 0}); // With this property we can click in the square
	this.cells.click(function(){
		if(flag){
			//console.log("Transforming to cell " + this.data("id"));
			string = "t" + (Math.floor(this.data("id") / rows)) * 50 + "," // Calculando el numero de columnas de la posicion de la celda
						 + (this.data("id") - (Math.floor(this.data("id") / rows)) * rows ) * 50; // Calculando Numero de fila de la posición de la celda
			//console.log("Translating " + charid + " al cell "+ this.data("id") + " con " + string);
			characters[charid].transform(string);
			flag = false;
		} else {
			/*string = " colum " + (Math.floor(this.data("id") / rows)) + "," // Calculando el numero de columnas de la posicion de la celda
						 + " Row "+ (this.data("id") - (Math.floor(this.data("id") / rows)) * rows ); // Calculando Numero de fila de la posición de la celda*/
			//console.log("Helow from " + this.data("id") + string);
			//console.log("Flag " + flag + " charid " + charid);
		}
	});
}

Grid.prototype.addCharacter = function(src,cellid)
{
	characters.push(this.paper.image(src, 5, 5, 40, 40)
								   .data("id", characters.length)
								   .click(function(){
										flag = true;
										charid = this.data("id");
										//console.log("you clicked " + flag + " " + charid);
									})
	);
	string = "t" + (Math.floor(cellid / this.rows)) * 50 + "," // Calculando el numero de columnas de la posicion de la celda
						 + (cellid - (Math.floor(cellid / this.rows)) * this.rows ) * 50;
	//console.log("Transforming to " + string);
	characters[characters.length -1].transform(string);
	//console.log("Character added in " + 5 + (Math.floor(cellid / this.rows)) * 55 + " , " + 5 + (cellid - (Math.floor(cellid / this.rows)) * this.rows ) * 55);
	/*this.characters.click(function(){
		console.log("you clicked " + this.data("id"));
	});*/
};