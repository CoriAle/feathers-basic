feathers = require('@feathersjs/feathers');
const { BadRequest } = require('@feathersjs/errors');

class Messages{

	constructor(){
		this.messages = [];
		this.currentId = 0;
	}

	async find(params){
		//Returna una lista de todos los mensajes
		return this.messages;
	}

	async get(id, params){
		//Encuentra un mensaje por id
		const messages = this.messages.find(message=> message.id === parseInt(id, 10));
		//Lanza un error si no fue encontrado
		if(!messages){
			throw new Error(`Mensaje con el id ${id} no encontrado`);
		}

		//Retornar el mensaje

		return messages;
	}

	async create(data, params){
		//Crea un nuevo objeto con la data original y un id
		//tomado icrementando el contador "currentId"
		const message = Object.assign({
			id: ++this.currentId
		}, data);

		this.messages.push(message);
		return message;
	}

	async patch(id, data, params){
		//Obtiene un mensaje existente, retorna error si no lo encuentra
		const message = await this.get(id);
		//Mezclar el mensaje existente con la nueva data
		//Y retorna rl resultado
		return new Object.assign(message, data);
	}

	async remove(id, params){
		//Obtener el mensaje por id, devuleve error si no encontrado
		const message = await this.get(id);

		//Encontrar el index del mensaje en el array
		const index = this.messages.indexOf(message);

		//Remover el mensaje encontrado
		this.messages.splice(index, 1);

		//REturnar el mensaje removido
		return message;
	}

}

const app = feathers();

//Inicializando el servicio de mensajes creando una nueva instancia
// de uestra clase
//Se registra el servicio en nuetra aplicación de feathers
app.use('messages', new Messages());




//Es frecuente que una aplicación utiliza una 
//funcionalidad similar a través de multiples servicios
//Los hooks son funciones middleware conectanbles que pueden
//ser registrdos antes, despueés o en error de un método de un servicio
//Pueden ser usados con cualquier servicio
//Usados comunmente para validaciones, autorizaciónes , logs, poblar entidades 
//relaciondas, enviar notificaciones entre otros.

/*app.service('messages').hook({
	before:{
		create(context){
			context.data.createdAt = new Date();
			return context;
		}
	}
})*/

//Un hook functio es una función que toma el contexto delhook como
//parámetro y devuelve el contexo o nada

const setTimestamp = name=>{
	return async context=>{

		//context es un objeto con info del servicio
		//props read-only: .app => la aplicación feathers
		/*				   .service => el servicio en el que corre este hook
						   .method => el méotodo del serivicio
						   .type => before, after, error*/
		/*Writeable
						 .params => los parámetros del servicio: query, provider: rest, socketio, primus, null;
						 .id => id de una llamada get, remove update o patch
						 .data => la data envida al servicio en create, update, patch (body)
						 .errors=> el error lanzado en el erro hooks
						 .result el resultado de la llamada del método del servicio en un hook after
		*/
		context.data[name] = new Date();
		return context;
	}
}

const validate = async context =>{
	const { data } = context;

	//Revisar si existe la propiedad text
	if(!data.text){
		throw new BadRequest('El mensaje debe tener un texto')
	}

	//Revisar si es string y no solo espacios en blanco
	if(typeof data.text !== 'string' || data.text.trim()=== ''){
		throw new BadRequest('El mensaje no es válido');
	}

	//Cambiar la data para se solamente el texto
	//Esto previende que las personas agreguen otras propiedades a la db

	context.data = {
		text: data.text.toString()
	}

	return context;
}
 //Registro del hook
const messageHooks = {
	before:{
		all: [],
		find: [],
		get: [],
		create: [validate, setTimestamp('createdAt')],
		update: [validate, setTimestamp('updatedAt')],
		patch: [validate, ],
		remove: [],
	},
	after:{
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: [],
	}
};

//Si un hook lanza un error, los siguintes hooks serán omitidos y se devolverá el error al usuario

//Aplication hook es llamado antes que los hooks de los servicios
app.service('messages').hooks(messageHooks);


app.hooks({
	error: async context=>{
		console.log(`Error en ${context.path} service, método ${context.method} `, context.error.stack );
	}
})


async function processMessages(){
	//Todo servicio se convierte en un event emmite
	//para los métodos que modifican

	//Escuchar cuando se ha reado un mensaje
	app.service('messages').on('created', message=>{
		console.log('Creamos un nuevo mensaje', message);
	});
	//Escuchar cuando se ha removido un mensaje
	app.service('messages').on('removed', message=>{
		console.log('Mensaje borrado', message);
	})



	//Obtener el servicio y llamar a cualquiera de sus métodos
	await app.service('messages').create({
		text: 'Primer mensaje'
	});

	const lastMessage = await app.service('messages').create({
		text: 'Segundo mensaje'
	});

	//Eliminar el mensaje que acabamos de crear

	await app.service('messages').remove(lastMessage.id);

	const messageList = await app.service('messages').find();
	console.log('Mensajes disponibles', messageList);

}
	processMessages();






