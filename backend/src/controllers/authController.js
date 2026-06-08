const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios'
      });
    }

    const usuarioQuery = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND activo = true',
      [correo]
    );

    if (usuarioQuery.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const usuario = usuarioQuery.rows[0];

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        message: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        rol: usuario.rol,
        departamento_id: usuario.departamento_id
      },
      process.env.JWT_SECRET || 'secret_key',
      {
        expiresIn: '8h'
      }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        rol: usuario.rol,
        departamento_id: usuario.departamento_id
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error del servidor'
    });
  }
};

module.exports = {
  login
};