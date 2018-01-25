require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')
const validator = require('validator')

module.exports = class ModalVolantes {

	nota_informativa(){
		$.confirm({
			title: 'Confronta',
			content : '¿El Oficio contiene Nota Informativa?',
			icon:'fa fa-question-circle',
			type:'blue',
			columnClass: 'col-md-5 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'SI',
					btnClass:'btn-primary',
					action:function(){
						$('input#notaConfronta').val('SI')
					}
				},
				cancel:{
					text:'NO',
					btnClass:'btn-red',
					action:function(){
						$('input#notaConfronta').val('NO')
					}
				}
			}
		})	
	}

	dictamen(){
		let html = require('./../templates/cuenta_publica.html')
		$.confirm({
			title: 'Cuenta Publica',
			content : html,
			icon:'fa fa-archive',
			type:'blue',
			columnClass: 'col-md-4 col-md-offset-1',
			draggable:false,
			buttons: {
				confirm:{
					text : 'Aceptar',
					btnClass:'btn-primary',
					action:function(){
						let cuenta = $('select#cuenta :selected').val()
						
						if(!validator.isEmpty(cuenta)){
							$('input#cta-publica').val(cuenta)
						}
					}
				}
			}
		})	
	}

	load_select_auditoria(){
		let html = require('./../templates/numero_auditoria.html')
		let self = this
		$.confirm({
			title: 'Auditoria',
			content : html,
			icon:'fa fa-book',
			type:'blue',
			columnClass: 'col-md-11 col-md-offset-1',
			draggable:false,
			onOpenBefore:function(){
				let cuenta = $('input#cta-publica').val()
				$('span#numero-auditoria').text(cuenta)
				$('input#numero-auditoria').keyup(function() {
					self.load_auditorias($(this).val(),cuenta)
				});
			},
			buttons:{
				confirm:{
					text : 'Aceptar',
					btnClass:'btn-primary',
					action:function(){
						
					}
				}
			}
		})
	}

	async load_auditorias(numero,cuenta){
		let response = await this.get_datos_auditorias(numero,cuenta);
		if(!response.error){

		$('div#errors-auditoria').hide()

		let table_auditoria = this.construct_table_datos_auditoria(response)

		let turnos = await this.get_turnos_auditoria(numero,cuenta)
		let table_turnos = this.construct_table_turnados_auditoria(turnos)

		$('table#datos-auditoria').show()
		$('table#datos-auditoria tbody').html(table_auditoria)

		$('table#turnados-auditoria').show()
		$('table#turnados-auditoria tbody').html(table_turnos)
		
		$('input#cveAuditoria').val(response.id)
		$('input#idRemitente').val(response.idArea)
		$('span#auditoria').text(`ASCM/${numero}/${cuenta.substring(4)}`)

		} else {
			
			$('div#errors-auditoria').html(response.error).show()
			$('input#cveAuditoria').val('')
			$('input#idRemitente').val('Error de Auditoria')
			$('span#auditoria').text('Numero de Auditoria No valido')

		}
	}

	get_datos_auditorias(clave,cuenta){
		let datos = new Promise(resolve=>{
			$.get({
				url: '/SIA/juridico/api/auditoria',
				data:{
					clave:clave,
					cuenta:cuenta
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}

	get_turnos_auditoria(clave,cuenta){
		let datos = new Promise(resolve=>{
			$.get({
				url: '/SIA/juridico/api/auditoria/turnos',
				data:{
					clave:clave,
					cuenta:cuenta
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}



	construct_table_datos_auditoria(data){
		let td = `<tr>
			<td>${data.sujeto}</td>
			<td>${data.rubro}</td>
			<td>${data.tipo}</td>
			</tr>`
		return td
	}


	construct_table_turnados_auditoria(data){
		let td = ''
		for(let x in data){
			td +=`<tr><td>${data[x].nombre}</td><td>${data[x].idTurnado}</td></tr>`
		}
		return td
	}













}