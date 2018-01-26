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

}