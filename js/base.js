const $ = require('jquery')
const validator = require('validator')
const modals = require('./modals')

const modal = new modals()

module.exports = class Base {

	cancel(){ 
	//funcion del boton cancelar de los formulario
		$('button#cancelar').click(function(e) {
			e.preventDefault()
			let ruta = $(this).data('ruta')
			location.href = `/SIA/juridico/${ruta}`
		})
	}


	load_update_form(){
		$('table#main-table-catalogos tbody tr').click(function(){
			let id = $(this).children().first().text()
			let ruta = $(this).data('ruta')
			location.href = `/SIA/juridico/${ruta}/${id}`
		})	
	}


	valida_string(datos,max){
	//funcion que valida las cadenas
		let resultados = new Array()
		$.each(datos, function(index, val) {
			 if(!validator.isAlpha(datos[index].value)){
			 	resultados.push({
			 		campo:datos[index].name,
			 		message:'El campo no puede estar vacio y/o solo puede contener Letras'
			 	})
			 } 

			 else if(!validator.isLength(datos[index].value,{min:1,max:max[index]})){
				 resultados.push({
			 		campo:datos[index].name,
			 		message:`El campo NO puede estar vacio y/o tener mas de ${max[index]} caracteres`
			 	})	
			} 
			
		})
		
		return resultados
	}


	valida_empty(datos) {

		let resultados = new Array()
		$.each(datos, function(index, val) {
			if(validator.isEmpty(datos[index].value)){
					 resultados.push({
				 		campo:datos[index].name,
				 		message:'El campo NO puede estar vacio'
				 	})	
				}
		})
		return resultados
	}



	valida_number(datos) {
	//funcion que valida los numeros
		let resultados = new Array()
		$.each(datos,function(index,el){
			
			let numero = parseInt(datos[index].value)
			
			if(Number.isNaN(numero)){
			 
				resultados.push({
					campo:datos[index].name,
					message:'El campo no puede estar vacio y/o solo acepta numeros'
				})
			}

		})
		return resultados
	}


	create_fields_validate(datos,nombres){
		let res = []
		let cont = -1
		for(let x in nombres){
			
			$.each(datos,function(index,el){

				if(datos[index].name == nombres[x]){

					res.push(datos[index])
					cont += 1 
				}
			})
		}

		return res
	}


	construct_table_errors(datos) {
	//construye la lista de errores
		let ul = ''

		$.each(datos, function(index, val) {
			 ul += `<ul>
			 		<li><strong>Campo:</strong> ${datos[index].campo}</li>
			 		<li><strong>Error:</strong> ${datos[index].message}</li>
			 		</ul>`
		})	
		
		return ul
	}


	async new_insert(datos,ruta){
	//resuelve la promesa de envio y 
		let test = await this.send_data(datos,ruta)
		if(test[0].campo != 'success'){
			let table = this.construct_table_errors(test)
			modal.errors(table)
		} else {
			modal.success(ruta)
		}
	}

	async new_update(datos,ruta){
		let res = await this.update_data(datos,ruta)
		if(res[0].campo != 'success'){
			let table = this.construct_table_errors(res)
			modal.errors(table)
		} else {
			modal.success_update(ruta)
		}	
	}


	update_data(datos,ruta){
		let promesa = new Promise(resolve =>{
			$.post({
				url:`/SIA/juridico/${ruta}/update`,
				data:datos,
				success:function(res){
					resolve(JSON.parse(res))
				}
			})
		})
		return promesa
	}

	send_data(datos,ruta) {
	// Promse de envio para insercion de un nuevo registro
		let promesa = new Promise(resolve => {
			$.post({
				url:`/SIA/juridico/${ruta}/create`,
				data:datos,
				success:function(res) {
					resolve(JSON.parse(res))
				}
			})
		})

		return promesa
	}
}