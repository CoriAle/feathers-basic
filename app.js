feathers = require('@feathersjs/feathers');

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




