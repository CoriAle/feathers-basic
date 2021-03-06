/*global io*/

//Crear una palicación de feathers
const app = feathers();
//Inicializando la conección rest
const rest = feathers.rest('http://localhost:3030');

//Configurar el cliente rest para usar window fetch

app.configure(rest.fetch(window.fetch));

app.service('messages').on('created', message=>{
	console.log("Creando un nuevo mensaje localmente", message)
})


async function createAndList(){
	await app.service('messages').create({
		text: "Hola desde feathers browser client"
	});

	const messages = await app.service('messages').find();

	console.log('Menssages', messages);
}

createAndList();