const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  imdbId: {
    type: String,
    required: [true, 'El ID de IMDb es requerido']
  },
  titulo: {
    type: String,
    required: true
  },
  comentario: {
    type: String,
    required: [true, 'El comentario es requerido'],
    minlength: 1,
    maxlength: 500
  },
  puntuacion: {
    type: Number,
    required: [true, 'La puntuación es requerida'],
    min: 1,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comentario', comentarioSchema);
