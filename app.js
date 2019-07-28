const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const express = require('@feathersjs/express');
const memory = require('feathers-memory');

//Una aplicación de feathers y de express
const app = express(feathers());

//Activando CORS
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//Activar body parsing
app.use(express.json());

//Activar url-encoded body parsing
app.use(express.urlencoded({extended: true}));

//Configurar el rest transport para usar express
app.configure(express.rest());

//Configurar transport de socket.io
app.configure(socketio());

//Agregar a todos al canal everybody
app.on('connection', connection=> app.channel('everybody').join(connection));

//Publicando todos los eventos del canal everybody

app.publish(()=> app.channel('everybody'));

//Inicializando el servicio de mensajes
app.use('messages', memory({
	paginate:{
		default: 10,
		max: 25
	}
}));

//Configurar el manejador de errores
app.use(express.errorHandler());

//Start server
const server = app.listen(3030);
server.on('listening', ()=> console.log("Feathers  API started at 3030 port"));
