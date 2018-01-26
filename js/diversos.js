const $ = require('jquery')
const validator = require('validator')
const bases = require('./base')
const base = new bases()

const modals = require('./modals')
const modal = new modals()

const volantes = require('./volantes')
const volante = new volantes()

const modalsDiversos = require('./../modals/diversos')
const diverso = new modalsDiversos()


module.exports = class Diversos {

	load_subdocumentos(){
		let self = this
		$('select#volantesDiversos').change(function(){
			let val = $(this).val()
			self.construct_sub_documentos(val)
		})
	}

	async construct_sub_documentos(tipo){
		let response = await volante.send_datos_subdocumentos(tipo,'NO')
		let option = '<option value="">Escoga una Opcion</option> '
		$.each(response,function(index,el){
			option += `<option value="${response[index].valor}">${response[index].nombre}</option>`
		})

		$('select#subDocumento').html(option)
	}

	load_remitentes(){
		$('select#tipoRemitente').change(function(){

			let tipoRemitente = $(this).val()
			diverso.remitentes(tipoRemitente)
		})
	}

	turnar(){
		let self = this
		$('button#btn-turnar').click(function(e){
			e.preventDefault()
			self.load_areas_turnados()
		})
	}

	async load_areas_turnados(){

		let datos = await this.load_areas_turnar()
		let table = this.construc_table_areas(datos)
		let html = require('./../templates/areas_turnar.html')
		let tabla = html.replace(':body:',table)
		diverso.turnar(tabla)
	}

	construc_table_areas(data){

		let tr = ''
		$.each(data, function(index, val) {
			tr += `<tr>
					<td><input type="checkbox" id="area" value="${data[index].idArea}"></td>
					<td>${data[index].nombre}</td>
					</tr>` 
		});

		return tr
		
	}


	load_areas_turnar() {
		
		let datos = new Promise(resolve =>{
			$.get({
				url:'/SIA/juridico/api/areas',
				success:function(json){
					resolve(JSON.parse(json))
				}
			})
		})
		return datos
	}

	form_submit(){
		let self = this
		$('form#diversos').submit(function(e){
			e.preventDefault()
			let datos = $(this).serializeArray()
			
			let valida_string = self.validate_fields_string(datos)
			let valida_numbers = self.valida_numbers(datos)
			let valida_areas = self.valida_areas(datos)
/*
			if(valida_string.length > 0 ){
				let tabla = base.construct_table_errors(valida_string)
				modal.errors(tabla)
			
			} else if (valida_numbers.length > 0) {

				let tabla = base.construct_table_errors(valida_numbers)
				modal.errors(tabla)
			
			} else if(valida_areas.length > 0 ){

				let tabla = base.construct_table_errors(valida_areas)
				modal.errors(tabla)

			} else {
				base.new_insert(datos,'VolantesDiversos')
			}
*/			
	base.new_insert(datos,'VolantesDiversos')

		})
	}

	validate_fields_string(datos){
		
		let campos = base.create_fields_validate(datos,['idTipoDocto','idRemitente','extemporaneo'])
		let validacion = base.valida_string(campos,[20,20,2,50])
		return validacion
	}

	valida_numbers(datos){
		let campos = base.create_fields_validate(datos,['folio','subFolio','idCaracter','idAccion','idSubTipoDocumento','anexos'])
		let validacion = base.valida_number(campos)
		return validacion	
	}

	valida_areas(datos){
		let campos = base.create_fields_validate(datos,['idTurnado'])
		let validacion = base.valida_empty(campos)
		return validacion
	}


}