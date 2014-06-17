io.sockets.on('connection', function(socket){
	socket.on('roommake', function(data){
		socket.join(data.roomname);
		socket.set('room', data.roomname);
		socket.set('nickname', data.nickname);
	});
});