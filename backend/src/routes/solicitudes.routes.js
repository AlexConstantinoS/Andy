const express = require('express');
const pool = require('../config/db');
const {
  verificarToken,
  autorizarRoles
} = require('../middlewares/auth.middleware');

const router = express.Router();

/*
  Crear solicitud
  Solo rol empleado.
*/
router.post(
  '/',
  verificarToken,
  autorizarRoles('empleado'),
  async (req, res) => {
    try {
      const empleado_id = req.usuario.id;

      const {
        numero_empleado_solicitante,
        nombre_completo_solicitante,
        departamento_id,
        dias_pendientes,
        dias_solicitados,
        fechas_vacaciones
      } = req.body;

      const numeroEmpleado = String(numero_empleado_solicitante || '').trim();
      const nombreCompleto = String(nombre_completo_solicitante || '').trim();
      const departamentoId = Number(departamento_id);
      const diasPendientes = Number(dias_pendientes);
      const diasSolicitados = Number(dias_solicitados);
      const fechasVacaciones = String(fechas_vacaciones || '').trim();

      if (!empleado_id) {
        return res.status(401).json({
          mensaje: 'No se encontró el usuario autenticado'
        });
      }

      if (!numeroEmpleado) {
        return res.status(400).json({
          mensaje: 'El número de empleado es obligatorio'
        });
      }

      if (numeroEmpleado.length > 50) {
        return res.status(400).json({
          mensaje: 'El número de empleado es demasiado largo'
        });
      }

      if (!nombreCompleto) {
        return res.status(400).json({
          mensaje: 'El nombre completo es obligatorio'
        });
      }

      if (nombreCompleto.length > 150) {
        return res.status(400).json({
          mensaje: 'El nombre completo es demasiado largo'
        });
      }

      if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
        return res.status(400).json({
          mensaje: 'Departamento inválido'
        });
      }

      if (!Number.isInteger(diasPendientes) || diasPendientes <= 0) {
        return res.status(400).json({
          mensaje: 'Los días pendientes deben ser un número positivo'
        });
      }

      if (!Number.isInteger(diasSolicitados) || diasSolicitados <= 0) {
        return res.status(400).json({
          mensaje: 'Los días solicitados deben ser un número positivo'
        });
      }

      if (diasSolicitados > diasPendientes) {
        return res.status(400).json({
          mensaje: 'Los días solicitados no pueden ser mayores a los días pendientes'
        });
      }

      if (!fechasVacaciones) {
        return res.status(400).json({
          mensaje: 'Debes seleccionar al menos una fecha de vacaciones'
        });
      }

      const fechas = fechasVacaciones
        .split(',')
        .map((fecha) => fecha.trim())
        .filter(Boolean);

      if (fechas.length === 0) {
        return res.status(400).json({
          mensaje: 'Debes seleccionar al menos una fecha válida'
        });
      }

      if (fechas.length !== diasSolicitados) {
        return res.status(400).json({
          mensaje: 'El número de fechas no coincide con los días solicitados'
        });
      }

      const fechasUnicas = new Set(fechas);

      if (fechasUnicas.size !== fechas.length) {
        return res.status(400).json({
          mensaje: 'No se permiten fechas repetidas'
        });
      }

      const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

      const fechasInvalidas = fechas.some((fecha) => !formatoFecha.test(fecha));

      if (fechasInvalidas) {
        return res.status(400).json({
          mensaje: 'Una o más fechas tienen formato inválido'
        });
      }

      const departamentoExiste = await pool.query(
        `
        SELECT id
        FROM departamentos
        WHERE id = $1
        `,
        [departamentoId]
      );

      if (departamentoExiste.rows.length === 0) {
        return res.status(400).json({
          mensaje: 'El departamento seleccionado no existe'
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
          numeroEmpleado,
          nombreCompleto,
          departamentoId,
          diasPendientes,
          diasSolicitados,
          fechas.join(', ')
        ]
      );

      res.status(201).json(resultado.rows[0]);

    } catch (error) {
      console.log(error);

      res.status(500).json({
        mensaje: 'Error al crear solicitud'
      });
    }
  }
);

/*
  Solicitudes para jefe
  Solo rol jefe.
*/
router.get(
  '/jefe',
  verificarToken,
  autorizarRoles('jefe'),
  async (req, res) => {
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
  }
);

/*
  Solicitudes para RH
  Solo rol rh.
*/
router.get(
  '/rh',
  verificarToken,
  autorizarRoles('rh'),
  async (req, res) => {
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
  }
);

/*
  Todas las solicitudes
  Solo RH puede ver historial general.
*/
router.get(
  '/',
  verificarToken,
  autorizarRoles('rh'),
  async (req, res) => {
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
  }
);

/*
  Actualizar solicitud
  Solo rol jefe.
  Por ahora valida rol; en el siguiente paso validaremos que solo pueda modificar
  solicitudes de su propio departamento.
*/
router.put(
  '/:id',
  verificarToken,
  autorizarRoles('jefe'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        estado,
        respuesta_jefe
      } = req.body;

      const departamentoJefe = req.usuario.departamento_id;

      if (!departamentoJefe) {
        return res.status(400).json({
          mensaje: 'El jefe no tiene departamento asignado'
        });
      }

      const estadosPermitidos = [
        'rechazada',
        'aceptada_jefe'
      ];

      if (!estado || !estadosPermitidos.includes(estado)) {
        return res.status(400).json({
          mensaje: 'Estado no válido'
        });
      }

      const solicitudExiste = await pool.query(
        `
        SELECT id, departamento_id, estado
        FROM solicitudes
        WHERE id = $1
        `,
        [id]
      );

      if (solicitudExiste.rows.length === 0) {
        return res.status(404).json({
          mensaje: 'Solicitud no encontrada'
        });
      }

      const solicitud = solicitudExiste.rows[0];

      if (solicitud.departamento_id !== departamentoJefe) {
        return res.status(403).json({
          mensaje: 'No tienes permiso para modificar solicitudes de otro departamento'
        });
      }

      if (solicitud.estado !== 'pendiente') {
        return res.status(400).json({
          mensaje: 'Solo se pueden modificar solicitudes pendientes'
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
          AND departamento_id = $4
        RETURNING *
        `,
        [
          estado,
          respuesta_jefe || null,
          id,
          departamentoJefe
        ]
      );

      if (resultado.rows.length === 0) {
        return res.status(403).json({
          mensaje: 'No se pudo actualizar la solicitud'
        });
      }

      res.json(resultado.rows[0]);

    } catch (error) {
      console.log(error);

      res.status(500).json({
        mensaje: 'Error al actualizar solicitud'
      });
    }
  }
);

module.exports = router;