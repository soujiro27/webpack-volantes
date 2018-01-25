require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')

module.exports = class {

	errors(html){
		$.confirm({
			title: 'Tu Registro NO pudo ser almacenado',
			content : html,
			icon:'fa fa-times-circle',
			type:'red',
			columnClass: 'col-md-5 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'Aceptar',
					btnClass:'btn-primary'
				}
			}
		})	
	}

	success(ruta){
		$.confirm({
			title: 'Tu Registro se ha almacenado Correctamente',
			content : '¿ Deseas agregar otro registro?',
			icon:'fa fa-check-circle',
			type:'green',
			columnClass: 'col-md-8 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'SI',
					btnClass:'btn-primary',
					action:function(){
						location.href = `/SIA/juridico/${ruta}/create`
					}
				},
				cancel:{
					text:'NO',
					btnClass:'btn-red',
					action:function(){
						location.href = `/SIA/juridico/${ruta}`	
					}
				}
			}
		})
	}


	success_update(ruta){
		$.confirm({
		title: 'Tu Registro se ha Actualizado Correctamente',
			content : '',
			icon:'fa fa-check-circle',
			type:'green',
			columnClass: 'col-md-8 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'Aceptar',
					btnClass:'btn-primary',
					action:function(){
						location.href = `/SIA/juridico/${ruta}`
					}
				}
			}
		})
	}
}