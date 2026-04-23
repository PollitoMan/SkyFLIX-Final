const express = require('express');
const router = express.Router();
const autenticacion = require('../middleware/autenticacion');
const {
  obtenerComentarios,
  obtenerComentariosUsuario,
  crearComentario,
  actualizarComentario,
  eliminarComentario
} = require('../controllers/comentarioController');

router.get('/usuario/mis', autenticacion, obtenerComentariosUsuario);
router.get('/:imdbId', obtenerComentarios);
router.post('/', autenticacion, crearComentario);
router.put('/:id', autenticacion, actualizarComentario);
router.delete('/:id', autenticacion, eliminarComentario);

module.exports = router;
