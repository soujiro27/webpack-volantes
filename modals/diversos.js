require("jquery-ui-browserify");
const $ = require('jquery')
const confirm = require('jquery-confirm')
const validator = require('validator')


module.exports = class ModalDiversos {

	remitentes(tipoRemintente){
		let html = require('./../templates/remitentes.html')
		let self = this
		$.confirm({
			title: 'Seleccione Remitente',
			content : html,
			icon:'fa fa-envelope-open-o',
			type:'blue',
			columnClass: 'col-md-11 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'Aceptar',
					btnClass:'btn-primary',
					action:function(){
					
						let input = $('input:radio[name=remitente]:checked')

						let idPuesto = input.val()
						let siglasArea =input.data('siglas')
						let nombre = input.parent().next().text()
						let puesto = input.parent().next().next().text()

						$('input#idRemitenteJuridico').val(idPuesto)
						$('input#idRemitente').val(siglasArea)
						$('input#nombreRemitente').val(nombre)
						$('input#puestoRemitente').val(puesto)



					}
				}
			},
			onOpenBefore:function(){
				$('input#remitente').keyup(function(event) {
					let siglas = $(this).val()
					self.construct_tabla_remitentes(tipoRemintente,siglas)
				});
			}
		})	
	}

	async construct_tabla_remitentes(tipo,siglas){

		let datos = await this.remitentes_volantes(tipo,siglas)
		let table = this.table_remitentes(datos)
		$('tbody#body-remitentes').html(table)
	}


	table_remitentes(data){
		let table = ''
    	$.each(data,function(index,el){
    		table += `<tr><td><input type="radio" name="remitente" value="${el.idRemitenteJuridico}" data-siglas="${el.siglasArea}"></td>
						<td>${el.saludo} ${el.nombre} </td>
						<td>${el.puesto}</td>
					</tr>`	
    	})
    	
    	return table
	}


	remitentes_volantes(dato,sigla) {
		let datos = new Promise(resolve =>{
			$.get({
				url:'/SIA/juridico/api/remitentes',
				data:{
					tipo:dato,
					siglas:sigla
				},
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}



	turnar(html){
		$.confirm({
			title: 'Seleccione Areas a Turnar',
			content : html,
			icon:'fa fa-address-book',
			type:'blue',
			columnClass: 'col-md-11 col-md-offset-1',
			draggable:false,
			buttons:{
				confirm:{
					text:'Aceptar',
					btnClass:'btn-primary',
					action:function(){
						let areas = []
						 $("input:checkbox:checked").each(function() {
             				areas.push($(this).val())
        				});
						$('input#idTurnado').val(areas)
					}
				}
			}

		})	
	}



}