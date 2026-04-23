const jwt = require('jsonwebtoken');

const autenticacion = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, error: 'No autorizado - No hay token' });
    }
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'No autorizado - Token inválido' });
  }
};

module.exports = autenticacion;
