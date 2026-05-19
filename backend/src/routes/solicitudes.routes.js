const express = require('express');
const pool = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', verificarToken, async (req, res) => {
  try {
    const {
      empleado_id,
      numero_empleado_solicitante,
      nombre_completo_solicitante,
      departamento_id,
      dias_pendientes,
      dias_solicitados,
      fechas_vacaciones
    } = req.body;

    if (
      !empleado_id ||
      !numero_empleado_solicitante ||
      !nombre_completo_solicitante ||
      !departamento_id ||
      !dias_pendientes ||
      !dias_solicitados ||
      !fechas_vacaciones
    ) {
      return res.status(400).json({
        mensaje: 'Faltan datos para crear la solicitud'
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO solicitudes
      (
        empleado_id,
        numero_empleado_solicitante,
        nombre_completo_solicitante,
        departamento_id,
        fecha_solicitud,
        dias_pendientes,
        dias_solicitados,
        fechas_vacaciones,
        estado
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        CURRENT_DATE,
        $5,
        $6,
        $7,
        'pendiente'
      )
      RETURNING *
      `,
      [
        empleado_id,
        numero_empleado_solicitante,
        nombre_completo_solicitante,
        departamento_id,
        dias_pendientes,
        dias_solicitados,
        fechas_vacaciones
      ]
    );

    res.json(resultado.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: 'Error al crear solicitud'
    });
  }
});

router.get('/jefe', verificarToken, async (req, res) => {
  try {
    const departamento_id = req.usuario.departamento_id;

    if (!departamento_id) {
      return res.status(400).json({
        mensaje: 'El usuario jefe no tiene departamento asignado'
      });
    }

    const resultado = await pool.query(
      `
      SELECT
        s.*,
        d.nombre AS nombre_departamento,
        jefe.nombre_completo AS jefe_autoriza,
        jefe.puesto AS puesto_jefe_autoriza
      FROM solicitudes s
      JOIN departamentos d ON d.id = s.departamento_id
      LEFT JOIN LATERAL (
        SELECT nombre_completo, puesto
        FROM usuarios
        WHERE departamento_id = s.departamento_id
          AND rol = 'jefe'
        ORDER BY id ASC
        LIMIT 1
      ) jefe ON true
      WHERE s.departamento_id = $1
      ORDER BY s.id DESC
      `,
      [departamento_id]
    );

    res.json(resultado.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: 'Error al obtener solicitudes del jefe'
    });
  }
});

router.get('/rh', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'rh') {
      return res.status(403).json({
        mensaje: 'No tienes permiso para ver solicitudes de Recursos Humanos'
      });
    }

    const resultado = await pool.query(
      `
      SELECT
        s.*,
        d.nombre AS nombre_departamento,
        jefe.nombre_completo AS jefe_autoriza,
        jefe.puesto AS puesto_jefe_autoriza
      FROM solicitudes s
      JOIN departamentos d ON d.id = s.departamento_id
      LEFT JOIN LATERAL (
        SELECT nombre_completo, puesto
        FROM usuarios
        WHERE departamento_id = s.departamento_id
          AND rol = 'jefe'
        ORDER BY id ASC
        LIMIT 1
      ) jefe ON true
      WHERE s.estado = 'aceptada_jefe'
      ORDER BY s.id DESC
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: 'Error al obtener solicitudes de Recursos Humanos'
    });
  }
});

router.get('/', verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(
      `
      SELECT
        s.*,
        d.nombre AS nombre_departamento,
        jefe.nombre_completo AS jefe_autoriza,
        jefe.puesto AS puesto_jefe_autoriza
      FROM solicitudes s
      JOIN departamentos d ON d.id = s.departamento_id
      LEFT JOIN LATERAL (
        SELECT nombre_completo, puesto
        FROM usuarios
        WHERE departamento_id = s.departamento_id
          AND rol = 'jefe'
        ORDER BY id ASC
        LIMIT 1
      ) jefe ON true
      ORDER BY s.id DESC
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: 'Error al obtener solicitudes'
    });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      estado,
      respuesta_jefe
    } = req.body;

    const estadosPermitidos = [
      'pendiente',
      'rechazada',
      'aceptada_jefe'
    ];

    if (!estado || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: 'Estado no válido'
      });
    }

    const resultado = await pool.query(
      `
      UPDATE solicitudes
      SET
        estado = $1,
        respuesta_jefe = $2,
        fecha_respuesta = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [
        estado,
        respuesta_jefe || null,
        id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Solicitud no encontrada'
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensaje: 'Error al actualizar solicitud'
    });
  }
});

module.exports = router;