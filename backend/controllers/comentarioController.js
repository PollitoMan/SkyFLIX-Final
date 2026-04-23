const Comentario = require('../models/Comentario');

exports.obtenerComentarios = async (req, res) => {
  try {
    const { imdbId } = req.params;
    if (!imdbId) {
      return res.status(400).json({ success: false, error: 'El ID de IMDb es requerido' });
    }
    const comentarios = await Comentario.find({ imdbId })
      .populate('usuario', 'nombre email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: comentarios.length, comentarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.obtenerComentariosUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const comentarios = await Comentario.find({ usuario: usuarioId })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, total: comentarios.length, comentarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.crearComentario = async (req, res) => {
  try {
    const { imdbId, titulo, comentario, puntuacion } = req.body;
    const usuarioId = req.usuario.id;
    if (!imdbId || !titulo || !comentario || puntuacion === undefined) {
      return res.status(400).json({ success: false, error: 'Por favor proporciona imdbId, titulo, comentario y puntuación' });
    }
    if (puntuacion < 1 || puntuacion > 10) {
      return res.status(400).json({ success: false, error: 'La puntuación debe estar entre 1 y 10' });
    }
    const nuevoComentario = await Comentario.create({ usuario: usuarioId, imdbId, titulo, comentario, puntuacion });
    await nuevoComentario.populate('usuario', 'nombre email');
    res.status(201).json({ success: true, message: 'Comentario creado exitosamente', comentario: nuevoComentario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.actualizarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario, puntuacion } = req.body;
    const usuarioId = req.usuario.id;
    let comentarioExistente = await Comentario.findById(id);
    if (!comentarioExistente) {
      return res.status(404).json({ success: false, error: 'Comentario no encontrado' });
    }
    if (comentarioExistente.usuario.toString() !== usuarioId) {
      return res.status(403).json({ success: false, error: 'No tienes permiso para editar este comentario' });
    }
    if (comentario) comentarioExistente.comentario = comentario;
    if (puntuacion !== undefined) {
      if (puntuacion < 1 || puntuacion > 10) {
        return res.status(400).json({ success: false, error: 'La puntuación debe estar entre 1 y 10' });
      }
      comentarioExistente.puntuacion = puntuacion;
    }
    comentarioExistente.updatedAt = Date.now();
    const comentarioActualizado = await comentarioExistente.save();
    await comentarioActualizado.populate('usuario', 'nombre email');
    res.status(200).json({ success: true, message: 'Comentario actualizado exitosamente', comentario: comentarioActualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.eliminarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    const comentario = await Comentario.findById(id);
    if (!comentario) {
      return res.status(404).json({ success: false, error: 'Comentario no encontrado' });
    }
    if (comentario.usuario.toString() !== usuarioId) {
      return res.status(403).json({ success: false, error: 'No tienes permiso para eliminar este comentario' });
    }
    await Comentario.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
