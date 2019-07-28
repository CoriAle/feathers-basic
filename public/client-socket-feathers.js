/*global io*/

//Creando un websocket conectando al server de Feathers
const socket = io('http://localhost:3030');

//Crear una palicación de feathers
const app = feathers();

//Congigurar socket io cliente para usar ese servicio
app.configure(feathers.socketio(socket));

app.service('messages').on("created", function(message){
	console.log('Alguien creó un mensaje', message);

});

async function createAndList(){
	await app.service('messages').create({
		text: "Hola desde feathers browser client"
	});

	const messages = await app.service('messages').find();

	console.log('Menssages', messages);
}

createAndList();