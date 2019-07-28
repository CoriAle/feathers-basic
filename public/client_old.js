const app = feathers();


//Registro de un simple servicio
//todo que retorn ael nombre y un texto

app.use('todos', {
	async get(name){
		//Retorna un objeto en la foma
		//{name, text}

		return {
			name,
			text: `Tienes que hacer ${name}`
		}
	}
});

//Una funación que obtiene y registra un todo
//Del servicio

async function getTodo(name){
	//Obtener el srvicio que registramos arriba
	const service = app.service('todos');
	//Llamar al método get con un nombre
	const todo = await service.get(name);

	//Log del todo que obtuvimos
	console.log(todo);
}

getTodo('dishes');