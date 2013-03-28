/*
This class is for the display and manipulation of the grid in the game
here we gone a handle all the related with the grid, events, images and
representation of the game.
*/

function Grid(rows, colums, background){
	console.log("Grid initialized");
	this.paper = Raphael(10, 50, 600, 290); // This part is static right now but we have to configurate later
	this.cells = this.paper.set(); // All the cells
	characters = this.paper.set(); // All the images of the avatars thar represent the player and other NPC's
	this.background = this.paper.image(background,0,10,400,250); // config
	this.rows = rows; //Number of colums 
	this.colums = colums; // Number of rows
	id = 0; //Id for the cells
	flag = false; //Flag for the movement of the characters
	charid = 0;
	//Creating the cells
	//console.log("Painting grid from rows " + rows + "colums" + colums);
	for (var i = 0 ; i < rows; i++) {
		for (var j = 0; j < colums; j++) {
			//console.log("Painting cell " + i + " " + j);
			this.cells.push(this.paper.rect(i * 50, 10 + j * 50, 50, 50)
									  .data("id",id++)
				);
		};
	};
	this.cells.attr({fill: "#000", "fill-opacity": 0}); // With this property we can click in the square
	this.cells.click(function(){
		if(flag){
			console.log("Transforming char " + charid);
			characters[charid].transform("t50,2.5r-90");
		} else {
			//console.log("Helow from " + this.data("id"));
			console.log("Flag " + flag + " charid " + charid);
		}
	});
}

Grid.prototype.addCharacter = function(src,x,y)
{
	characters.push(this.paper.image(src,x,y,40,40)
								   .data("id", characters.length)
								   .click(function(){
										flag = true;
										charid = this.data("id");
										console.log("you clicked " + flag + " " + charid);
									})
	);
	//console.log("Character added");
	/*this.characters.click(function(){
		console.log("you clicked " + this.data("id"));
	});*/
};