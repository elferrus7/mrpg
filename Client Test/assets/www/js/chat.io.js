(function($){

	// create global app parameters...
	var NICK_MAX_LENGTH = 15,
		ROOM_MAX_LENGTH = 10,
		lockShakeAnimation = false,
		socket = null,
		clientId = null,
		nickname = null,
		clientPassed = [],

		// holds the current room we are in
		currentRoom = null,

		// server information
		serverAddress = '10.25.71.115:8080',
		serverDisplayName = 'Server',
		serverDisplayColor = '#1c5380';
		var grid = new Grid(6,10,"img/game-map.jpg");
		
	// bind DOM elements like button clicks and keydown
	function bindDOMEvents(){

		$('.rooms').on('click', function(){
				socket.emit('requestList');
		});	

		$('#passTurn').on('click',function(){
			if(sessionStorage.turn == true || sessionStorage.turn == "true"){
				// Obtiene el grid que cambio
				jason = grid.returnJson();

				// Bloquear el grid para que no pueda usarlo 
				// hasta que sea su turno nuevamente
				///////////// GRID.BLOCK();

				// La bandera de turno se deshabilita hasta que sea su turno nuevamente
				sessionStorage.turn = false;

				// Broadcastea el cambio a los demas
				//console.log({json: JSON.stringify(jason), room: currentRoom});
				socket.emit('updateGrid', {json: JSON.stringify(jason), room: currentRoom} );

				// 	Ver quien sigue en turno
				//	clientPassed: Matriz que contiene que falta por pasar
				//	clientPassed: Es nula para el primero que tenga turno en el juego.
				socket.emit('passTurn', {room: currentRoom, username: nickname, faltan: clientPassed});
			}else{
				// display the message in the chat window
				insertMessage("Server", "NO es tu turno !", true, true);				
			}
		});

		$('.submitbtn').on('click', function(){
			handleMessage();
		});

		$('.connect').on('click', function(){
			 { handleNickname2(); }
		});

		$('#nickname-popup .begin').on('click', function(){
			handleNickname();
		});

		$('.addRoom').on('click', function(){
			createRoom();
		});

		$('#finish').on('click', function(){
			handleUsername(sessionStorage.username);
			//sessionStorage.time = new Date();
			sessionStorage.room = $('#gameName').val();
			sessionStorage.json = JSON.stringify(grid.returnJson());
			sessionStorage.gm = true;
			sessionStorage.descripcion = $('#descripcion').val();

            window.location = "index.html";
        });

		$('#login').on('click', function(){
			var username = $('#inputUsername').val();
			sessionStorage.username = username;
			handleUsername(username, "lobby");

			socket.emit('login', {username: username, password:$('#inputPassword').val()});
		});

		$('#signup').on('click', function(){
			var username = $('#username').val();
			var password = $('#password').val();
			handleUsername(username, "lobby");

			socket.emit('sign', {usr: $('#username').val(), pwd: $('#password').val()});
		});
		

		$('.chat-rooms').on('click', function(){
			handleUsername(sessionStorage.username,"lobby");
            socket.emit('requestList');
		});

		$('#game').on('click',function (){
			if(sessionStorage.gm){

				if(sessionStorage.room == "" || sessionStorage.room == null){
					handleUsername(sessionStorage.username, sessionStorage.username);
				}else{
					handleUsername(sessionStorage.username, sessionStorage.room);
				}

				// Broadcastea el cambio a los demas
				//console.log(jason);
				socket.emit('createGame', {json: sessionStorage.json, room: sessionStorage.room, descripcion: sessionStorage.descripcion, names: sessionStorage.username} );

				// Show los botones de GM
				//////////SHOW BOTONES CHINGONES

				// Cambiar el nickname para saber que EL es el game master
				nickname = "GM - " + sessionStorage.username;
				sessionStorage.turn = true;
				var jason = JSON.parse(sessionStorage.json)
				//var grid = new Grid(6,10,jason[jason.length-1].background);
				grid.setBackground(jason[jason.length-1].background);
				grid.createCells();
				for(var i in jason){
					if(jason[i].src != null){
						grid.addCharacter(jason[i].src,jason[i].cell);
					}
				}
				/*var tIni = sessionStorage.time;
				var tFinal = new Date();

				var difT = tIni - tFinal;
				console.log('Tiempo inicial');
				console.log(tIni);
				console.log('Tiempo Final');
				console.log(tFinal);
				console.log('Tiempo de carga en milisegundos ');
				console.log(difT);*/
			} else {

				handleUsername(sessionStorage.username, sessionStorage.room);
				socket.emit('getGame',{room:sessionStorage.room});
				sessionStorage.turn = false;
			}
			
		});

		$('.background').click(function(){
                        //console.log($(this).find('img').attr('src'));
            grid.setBackground($(this).find('img').attr('src'));
            var map = $(this).find('img').attr('src');
        });

        $('.npc').click(function (){
            npc = $(this).find('img').attr('src');
            flagAdd = true;
        });

        $('#wrap2').hide();
                    $('#finish').hide();
                    $('#next').click(function (){
                        $('#wrap').hide();
                        $('#wrap2').show();
                        $('#next').hide();
                        $('#finish').show();
                        grid.createCells();
                        var cells = grid.getCells();
                        cells.click(function (){
                            if (flagAdd){
                                grid.addCharacter(npc,this.data('id'));
                                flagAdd = false;
                            }
                        });
                    });

        $('#d6').on('click', function (){
        	var r = Math.floor((Math.random()*6)+1);
			console.log(r);
			var roll = "D6 : " + r;			
			// send the message to the server with the room name
			socket.emit('chatmessage', { message: roll, room: currentRoom, names: nickname, hour: getTime() });
			
			// display the message in the chat window
			insertMessage(nickname, roll, true, true);
        });
        $('#d12').on('click', function (){
        	var r = Math.floor((Math.random()*12)+1);
        	var roll = "D12 : " + r;		
			// send the message to the server with the room name
			socket.emit('chatmessage', { message: roll, room: currentRoom, names: nickname, hour: getTime() });
			
			// display the message in the chat window
			insertMessage(nickname, roll, true, true);
        });
        $('#d20').on('click', function (){
        	var r = Math.floor((Math.random()*20)+1);
        	var roll = "D20 : " + r;		
        	// send the message to the server with the room name
			socket.emit('chatmessage', { message: roll, room: currentRoom, names: nickname, hour: getTime() });
			
			// display the message in the chat window
			insertMessage(nickname, roll, true, true);
        });
	}

	// bind socket.io event handlers
	// this events fired in the server
	function bindSocketEvents(gameroom){

		// when the connection is made, the server emiting
		// the 'connect' event
		socket.on('connect', function(){
			// firing back the connect event to the server
			// and sending the nickname for the connected client

			socket.emit('connect', { nickname: nickname, room: gameroom });
		});
		
		// after the server created a client for us, the ready event
		// is fired in the server with our clientId, now we can start 
		socket.on('ready', function(data){
			// hiding the 'connecting...' message
			/*$('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
				$(this).hide();
				$('.chat input').focus();
			});*/
			
			// saving the clientId localy
			clientId = data.clientId;
		});

		// after the initialize, the server sends a list of
		// all the active rooms
		socket.on('roomslist', function(data){
			for(var i = 0, len = data.rooms.length; i < len; i++){
				// in socket.io, their is always one default room
				// without a name (empty string), every socket is automaticaly
				// joined to this room, however, we don't want this room to be
				// displayed in the rooms list
				if(data.rooms[i] != ''){
					addRoom(data.rooms[i], false);
					//var aux = data.rooms[i].replace('/','');
					//$('.roomlog').val($('.roomlog').val() + aux + "\n");
				}
			}
		});

		// after the initialize, the server sends a list of
		// all the active rooms
		socket.on('disconnectTurn', function(data){
			if(sessionStorage.turn == true){
				// 	Ver quien sigue en turno
				//	clientPassed: Matriz que contiene que falta por pasar
				//	clientPassed: Es nula para el primero que tenga turno en el juego.
				socket.emit('passTurn', {room: data.room, username: data.client.nickname, faltan: clientPassed});
			}
		});

		// after the initialize, the server sends a list of
		// all the active rooms
		socket.on('displaylist', function(data){
			// Clear the rooms
			$('.roomlog').val("");

			var table = "<br/><br/><font color='white'> <table cellpadding='3' cellspacing='3' border='2' class='display' bordercolor='white' id='example'>";

			//$('#dynamic').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example">');

			// loop through the rooms and display them

			for(var i = 0, len = data.rooms.length; i < len; i++){
				if(data.rooms[i].room != ''){
					var aux = data.rooms[i].room.replace('/','');
					if(aux != "lobby"){
						table += "<tr id='"+ aux +"' class='game'> <th>"+ aux +"</th> <th>"+ data.rooms[i].descripcion +" </th> </tr>";
//						$('.roomlog').val($('.roomlog').val() + aux + "\n");
					}
				}
			}
			table += "</table></font>";
			document.getElementById("dynamic").innerHTML = table;	

			$(".game").click(function(){
				var gameroom = $(this).attr('id');

				// Save the room to be subscriten
				sessionStorage.room = gameroom;
				
				window.location = "index.html";
			});
		
		});

		// when someone sends a message, the sever push it to
		// our client through this event with a relevant data
		socket.on('chatmessage', function(data){
			var nickname = data.names;
			var message = data.message;
			
			//display the message in the chat window
			insertMessage(nickname, message, true, false, false);
		});
		
		socket.on('updateGrid',function(data){
			//Updetea TU GRID
			 grid.updateGrid(data);
		});

		// when we subscribes to a room, the server sends a list
		// with the clients in this room
		socket.on('roomclients', function(data){
			
			// add the room name to the rooms list
			addRoom(data.room, false);

			// set the current room
			setCurrentRoom(data.room);
			
			// announce a welcome message
			//insertMessage(serverDisplayName, 'Welcome to the room: `' + data.room + '`... enjoy!', true, false, true);
	
			insertMessage(serverDisplayName, data.chatlogs , true, false, true);

			// add the clients to the clients list
			addClient({ nickname: nickname, clientId: clientId }, false, true);
			for(var i = 0, len = data.clients.length; i < len; i++){
				if(data.clients[i]){
					addClient(data.clients[i], false);
				}
			}
		});
		
		// if someone creates a room the server updates us
		// about it
		socket.on('addroom', function(data){
			addRoom(data.room, true);
		});
		
		// if one of the room is empty from clients, the server,
		// destroys it and updates us
		socket.on('removeroom', function(data){
			removeRoom(data.room, true);
		});
		
		// with this event the server tells us when a client
		// is connected or disconnected to the current room
		socket.on('presence', function(data){
			if(data.state == 'online'){
				addClient(data.client, true);
			} else if(data.state == 'offline'){

				removeClient(data.client, true);
			}
		});

		socket.on('login',function(data){
			if(data.bool){
				window.location = 'joinGame.html';
			} else{
				alert('Try another Username/Password');
			}
		});

		socket.on('signup',function(data){
			if(data.bool){
				window.location = 'login.html';
			} else{
				alert('Try another Username/Password');
			}
		});

		// Whos turn is it
		// data.clients: Todos los clientes del room
		// daa.pased: Todos los clientes q faltan por pasar
		socket.on('nextTurn', function(data){
			if(data.passed[0] == nickname){
				sessionStorage.turn = true;

			var mess = "Es turno de "+nickname;
			// send the message to the server with the room name
			socket.emit('chatmessage', { message: mess, room: currentRoom, names: "Server", hour: getTime() });
			
			// display the message in the chat window
			insertMessage("Server", "Es tu TURNO !", true, true);

			}

			removeA(data.passed, nickname);
			clientPassed = data.passed;
		});

		socket.on('startGame', function (data){
			var jason = JSON.parse(data)
			grid.setBackground(jason[jason.length-1].background);
				grid.createCells();
				for(var i in jason){
					if(jason[i].src != null){
						grid.addCharacter(jason[i].src,jason[i].cell);
					}
				}
		});

	}

    // Remove item from array
    function removeA(arr) {
	    var what, a = arguments, L = a.length, ax;
	    while (L > 1 && arr.length) {
	        what = a[--L];
	        while ((ax= arr.indexOf(what)) !== -1) {
	            arr.splice(ax, 1);
	        }
	    }
	    return arr;
	}

    // add a room to the rooms list, socket.io may add
	// a trailing '/' to the name so we are clearing it
	function addRoom(name, announce){
		// clear the trailing '/'
		//name = name.replace('/','');

		// check if the room is not already in the list
		//if($('.chat-rooms ul li[data-roomId="' + name + '"]').length == 0){
			//$.tmpl(tmplt.room, { room: name }).appendTo('.chat-rooms ul');
			// if announce is true, show a message about this room
			//if(announce){
				//insertMessage(serverDisplayName, 'The room `' + name + '` created...', true, false, true);
			//}
		//}
	}

	// remove a room from the rooms list
	function removeRoom(name, announce){
		//$('.chat-rooms ul li[data-roomId="' + name + '"]').remove();
		// if announce is true, show a message about this room
		//if(announce){
			//insertMessage(serverDisplayName, 'The room `' + name + '` destroyed...', true, false, true);
		//}
	}

	// add a client to the clients list
	function addClient(client, announce, isMe){
		/*var $html = $.tmpl(tmplt.client, client);
		
		// if this is our client, mark him with color
		if(isMe){
			$html.addClass('me');
		}
*/
		// if announce is true, show a message about this client
		if(announce){
			insertMessage(serverDisplayName, client.nickname + ' has joined the room...', true, false, true);
			var aux = "\nServer: " + client.nickname + ' has joined the room...';
			//socket.emit('chatlog', { message: aux, room: currentRoom });
		}
		
	}

	// remove a client from the clients list
	function removeClient(client, announce){
		//$('.chat-clients ul li[data-clientId="' + client.clientId + '"]').remove();
		
		// if announce is true, show a message about this room
		if(announce){
			insertMessage(serverDisplayName, client.nickname + ' has left the room...', true, false, true);
			var aux = "\nServer: " + client.nickname + ' has left the room...'
			//socket.emit('chatlog', { message: aux, room: currentRoom });
		}
	}

	// every client can create a new room, when creating one, the client
	// is unsubscribed from the current room and then subscribed to the
	// room he just created, if he trying to create a room with the same
	// name like another room, then the server will subscribe the user
	// to the existing room
	function createRoom(){
		var room = prompt("Dame el nombre del nuevo Room","room1");
		if(room && room.length <= ROOM_MAX_LENGTH && room != currentRoom){
			
			// show room creating message
			//$('.chat-shadow').show().find('.content').html('Creating room: ' + room + '...');
			//$('.chat-shadow').animate({ 'opacity': 1 }, 200);.

			// unsubscribe from the current room
			socket.emit('unsubscribe', { room: currentRoom, user: nickname });

			// create and subscribe to the new room
			socket.emit('subscribe', { room: room });
		}
	}

	// sets the current room when the client
	// makes a subscription
	function setCurrentRoom(room){
		currentRoom = room;
		$('.chat-rooms ul li.selected').removeClass('selected');
		$('.chat-rooms ul li[data-roomId="' + room + '"]').addClass('selected');
	}

	function handleUsername(nick, gameroom){
		if(nick && nick.length <= NICK_MAX_LENGTH){
			nickname = nick;
			connect(gameroom);
		}
	}

	// handle the client messages
	function handleMessage(){
		var message = $('.mchat').val().trim();	
		if(message){

			// send the message to the server with the room name
			socket.emit('chatmessage', { message: message, room: currentRoom, names: nickname, hour: getTime() });
			
			// display the message in the chat window
			insertMessage(nickname, message, true, true);
			$('.mchat').val('');
		}
	}

	// insert a message to the chat window, this function can be
	// called with some flags
	function insertMessage(sender, message, showTime, isMe, isServer){
		var $ms = sender + ": " + message+"\n";
		// if isMe is true, mark this message so we can
		// know that this is our message in the chat window
		/*if(isMe){
			$html.addClass('marker');
		}*/

		// if isServer is true, mark this message as a server
		// message
		if(isServer){
			$('.chatlog').val($('.chatlog').val() + $ms);
		}else{
			$('.chatlog').val($('.chatlog').val() + getTime() + " " + $ms);
			$('.chatlog').animate({ scrollTop: $('.chatlog').height() }, 100);
		}
	}

	// return a short time format for the messages
	function getTime(){
		var date = new Date();
		return (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours()) + ':' +
				(date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes()) + ':' + date.getSeconds()	+ ':' + date.getMilliseconds();
	}
	
	// after selecting a nickname we call this function
	// in order to init the connection with the server
	function connect(gameroom){
		// show connecting message
		//$('.chat-shadow .content').html('Connecting...');
		
		// creating the connection and saving the socket
		socket = io.connect(serverAddress);
		// now that we have the socket we can bind events to it
		bindSocketEvents(gameroom);
	}

	// on document ready, bind the DOM elements to events
	$(function(){
		bindDOMEvents();
	});

}) (jQuery);