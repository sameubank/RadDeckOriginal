io.sockets.on 'connection', (socket) ->
	log socket.id
	
	socket.on 'deck:move', (forward) ->
		for id, client of io.sockets.sockets
			if id isnt socket.id
				log 'From ' + socket.id + ' moving ' + id + ' ' + (forward ? 'ahead' : 'back')
				client.emit 'deck:moved', forward
