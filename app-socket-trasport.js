const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');
const express = require('@feathersjs/express');


const app = feathers();

//Configurar transport de socket.io
app.configure(socketio());

//Start server
app.listen(3030);