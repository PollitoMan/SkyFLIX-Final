const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.registro = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;
    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ success: false, error: 'Por favor proporciona nombre, email y contraseña' });
    }
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, error: 'El email ya está registrado' });
    }
    const usuario = await Usuario.create({ nombre, email, contraseña });
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
      return res.status(400).json({ success: false, error: 'Por favor proporciona email y contraseña' });
    }
    const usuario = await Usuario.findOne({ email }).select('+contraseña');
    if (!usuario) {
      return res.status(401).json({ success: false, error: 'Email o contraseña inválidos' });
    }
    const valida = await usuario.compararContraseña(contraseña);
    if (!valida) {
      return res.status(401).json({ success: false, error: 'Email o contraseña inválidos' });
    }
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.status(200).json({
      success: true,
      message: 'Sesión iniciada exitosamente',
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
