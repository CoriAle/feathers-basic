/*global io*/

//Creando un websocket conectando al server de Feathers
const socket = io('http://localhost:3030');

//Escuahar cuando nuevos mensajes se han creado
socket.on('messages created', message=>{
	console.log('Alguien creo un mensaje', message);
});

socket.emit('create', 'messages', {
	text: "Hola desde socket"
}, function(error, result){
	if(error) throw error;
	socket.emit('find', 'messages', function(error, messageList){
		if(error) throw error;
		console.log('Mensajes actuales', messageList);

	});

})