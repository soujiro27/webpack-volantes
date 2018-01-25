const $ = require('jquery')
const validator = require('validator')
const bases = require('./base')
const base = new bases()

const modals = require('./modals')
const modal = new modals()

const modalsVolantes = require('./../modals/volantes')
const modalVolante = new modalsVolantes()


module.exports = class Volantes {

	load_subdocumentos() {
		let self = this
		$('select#idDocumento').change(function(){
			let val = $(this).val()
			self.construct_sub_documentos(val)
		})
	}

	async construct_sub_documentos(tipo){
		let response = await this.send_datos_subdocumentos(tipo,'SI')
		let option = '<option value="">Escoga una Opcion</option> '
		$.each(response,function(index,el){
			option += `<option value="${response[index].valor}">${response[index].nombre}</option>`
		})

		$('select#subDocumento').html(option)


	}

	send_datos_subdocumentos(tipo,audi){
		let promesa = new Promise(resolve =>{
			$.get({
				url: '/SIA/juridico/api/subDocumentos',
				data:{
					tipo,
					audi
				},
				success:function(res){
					resolve(JSON.parse(res))
				}
			})
		})
		return promesa
	}

	modal_subDocumento(){
		
		$('select#subDocumento').change(function(){

			let subDocumento = $('select#subDocumento :selected').text()
			let documento = $('select#idDocumento :selected').val()
			console.log(subDocumento)
			console.log(documento)

			if(documento === 'OFICIO' && subDocumento === 'CONFRONTA' ){
				
				modalVolante.nota_informativa()
			
			} else if (documento === 'OFICIO' && subDocumento === 'DICTAMEN' ) {
			
				modalVolante.dictamen()
			} else {

				$('input#notaConfronta').val('NO')
				let cuentaActual = $('input#cta-publica').data('cuenta')
				$('input#cta-publica').val(cuentaActual)
			}
		})
	}

	modal_auditoria(){
		$('button#modalAuditoria').click(function(event){
			event.preventDefault()
			modalVolante.load_select_auditoria()
		})
	}

	form_submit(){
		let self = this
		$('form#Volantes').submit(function(e){
			e.preventDefault()
			let datos = $(this).serializeArray()

			let valida_string = self.validate_fields_string(datos)
			let valida_auditoria = self.validate_field_auditoria(datos)
			let valida_numbers = self.valida_numbers(datos)

			if(valida_string.length > 0 ){
				
				let tabla = base.construct_table_errors(valida_string)
				modal.errors(tabla)

			} else if (valida_auditoria.length > 0) {
				
				let tabla = base.construct_table_errors(valida_auditoria)
				modal.errors(tabla)

			} else if (valida_numbers.length > 0) {

				let tabla = base.construct_table_errors(valida_numbers)
				modal.errors(tabla)
			}

		})
	}

	validate_fields_string(datos){
		let campos = base.create_fields_validate(datos,['documento','promocion','extemporaneo','idTurnado'])
		let validacion = base.valida_string(campos,[10,2,2,20])
		return validacion
	}

	validate_field_auditoria(datos){
		let campo = base.create_fields_validate(datos,['cveAuditoria'])
		let validacion = this.valida_auditoria(campo)
		return validacion
	}

	valida_auditoria(datos) {
	//funcion que valida el numero de auditoria
		let resultados = new Array()
		let numero = parseInt(datos[0].value)
		if(Number.isNaN(numero)){
			 
			 resultados.push({
				campo:datos[0].name,
				message:'No has seleccionado Auditoria'
			 })
		}
		return resultados
	}

	valida_numbers(datos){
		let campos = base.create_fields_validate(datos,['folio','subFolio','idCaracter','idAccion','subDocumento','anexos'])
		let validacion = base.valida_number(campos)
		return validacion	
	}
}