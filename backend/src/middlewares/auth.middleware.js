const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: 'Token requerido'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        mensaje: 'Formato de token inválido'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_key'
    );

    req.usuario = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
};

const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: 'Usuario no autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: 'No tienes permiso para acceder a esta ruta'
      });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  autorizarRoles
};