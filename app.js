const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const memory = require('feathers-memory');

const app = express(feathers());

//activar body-parsing

app.use(express.json());

//Activiar url-enconded body parsing

app.use(express.urlencoded({extended: true}));

//configurar un transport rest
app.configure(express.rest());


//Se tiene un crud completo
app.use('messages', memory({
	paginate:{
		default: 10,
		max: 25
	}
}));

//Configurar manejo de errores
app.use(express.errorHandler());

//Start server 
const server = app.listen(3030);

//Usar el servicio para crear un mensaje en el server
app.service('messages').create({
	text: "Hola desde el servidor"
});

server.on('listening', ()=> console.log("Feathers REST API started at 3030 port"));