require('babelify-es6-polyfill')
const $ = require('jquery')

const volantes = require('./js/volantes')
const volante = new volantes()
 
const bases = require('./js/base')
const base = new bases()

const diversos = require('./js/diversos')
const diverso = new diversos()

$('input.fechaInput').datepicker({ dateFormat: "yy-mm-dd" });

base.cancel()
base.load_update_form()

volante.load_subdocumentos()
volante.modal_subDocumento()
volante.modal_auditoria()
volante.form_submit()
volante.form_update()


diverso.load_subdocumentos()
diverso.load_remitentes()
diverso.turnar()
diverso.turnar_update()
diverso.form_submit()	
diverso.form_update()