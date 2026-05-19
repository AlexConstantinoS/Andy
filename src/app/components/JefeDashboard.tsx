import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  CheckCircle,
  Clock,
  LogOut,
} from 'lucide-react';

interface JefeDashboardProps {
  usuario: any;
  onLogout: () => void;
}

export default function JefeDashboard({
  usuario,
  onLogout,
}: JefeDashboardProps) {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<any>(null);

  const [filtro, setFiltro] = useState<
    'todas' | 'pendiente' | 'aceptada_jefe' | 'rechazada'
  >('todas');

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const obtenerSolicitudes = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:3000/api/solicitudes/jefe',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSolicitudes(response.data);
    } catch (error: any) {
      console.log(error);

      if (error.response) {
        console.log(error.response.data);
      }

      alert('Error al obtener solicitudes');
    }
  };

  const handleAutorizar = async (solicitudId: number) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:3000/api/solicitudes/${solicitudId}`,
        {
          estado: 'aceptada_jefe',
          respuesta_jefe: 'Solicitud autorizada por jefe',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await obtenerSolicitudes();
      setSolicitudSeleccionada(null);

      alert('Solicitud autorizada por jefe');
    } catch (error) {
      console.log(error);
      alert('Error al autorizar');
    }
  };

  const handleRechazar = async (solicitudId: number) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:3000/api/solicitudes/${solicitudId}`,
        {
          estado: 'rechazada',
          respuesta_jefe: 'Solicitud rechazada',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await obtenerSolicitudes();
      setSolicitudSeleccionada(null);

      alert('Solicitud rechazada');
    } catch (error) {
      console.log(error);
      alert('Error al rechazar');
    }
  };

  const formatearFechas = (fechas: any) => {
    if (Array.isArray(fechas)) {
      return fechas.map((fecha: string, index: number) => (
        <p key={index}>
          {new Date(fecha).toLocaleDateString('es-MX')}
        </p>
      ));
    }

    return <p>{fechas}</p>;
  };

  const solicitudesFiltradas =
    filtro === 'todas'
      ? solicitudes
      : solicitudes.filter((s) => s.estado === filtro);

  const pendientes = solicitudes.filter(
    (s) => s.estado === 'pendiente'
  ).length;

  const autorizadas = solicitudes.filter(
    (s) => s.estado === 'aceptada_jefe'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portal del Jefe
              </h1>

              <p className="text-sm text-gray-600">
                {usuario?.nombre}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Pendientes
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {pendientes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Autorizadas
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {autorizadas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Total
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {solicitudes.length}
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow">

          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">

              <h2 className="text-xl font-bold text-gray-900">
                Solicitudes de Vacaciones
              </h2>

              <div className="flex gap-2">
                {(
                  ['todas', 'pendiente', 'aceptada_jefe', 'rechazada'] as const
                ).map((estado) => (
                  <button
                    key={estado}
                    onClick={() => setFiltro(estado)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filtro === estado
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {estado.toUpperCase()}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <div className="p-6">
            {solicitudesFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay solicitudes
              </p>
            ) : (
              <div className="space-y-4">
                {solicitudesFiltradas.map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >

                    <div className="flex justify-between items-start mb-3">

                      <div>
                        <p className="font-bold text-gray-900">
                          Empleado solicitante
                        </p>

                        <p className="text-sm text-gray-700">
                          <strong>Número:</strong>{' '}
                          {solicitud.numero_empleado_solicitante || 'Sin número'}
                        </p>

                        <p className="text-sm text-gray-700">
                          <strong>Nombre:</strong>{' '}
                          {solicitud.nombre_completo_solicitante || 'Sin nombre'}
                        </p>

                        <p className="text-sm text-gray-600">
                          <strong>Departamento:</strong>{' '}
                          {solicitud.nombre_departamento ||
                            `Departamento #${solicitud.departamento_id}`}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          solicitud.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : solicitud.estado === 'aceptada_jefe'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {solicitud.estado.toUpperCase()}
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">

                      <div>
                        <p className="text-gray-600">
                          Fechas:
                        </p>

                        <div className="font-medium text-gray-900">
                          {formatearFechas(solicitud.fechas_vacaciones)}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600">
                          Días solicitados:
                        </p>

                        <p className="font-medium">
                          {solicitud.dias_solicitados}
                        </p>
                      </div>

                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Fecha solicitud:{' '}
                      {new Date(
                        solicitud.fecha_solicitud
                      ).toLocaleDateString('es-MX')}
                    </p>

                    {solicitud.respuesta_jefe && (
                      <div className="mb-3 bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Respuesta:</strong>{' '}
                          {solicitud.respuesta_jefe}
                        </p>
                      </div>
                    )}

                    {solicitud.estado === 'pendiente' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() =>
                            setSolicitudSeleccionada(solicitud)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Revisar
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-lg max-w-md w-full p-6">

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Revisar Solicitud
            </h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">

              <p className="font-bold text-gray-900">
                Empleado solicitante
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <strong>Número:</strong>{' '}
                {solicitudSeleccionada.numero_empleado_solicitante || 'Sin número'}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                <strong>Nombre:</strong>{' '}
                {solicitudSeleccionada.nombre_completo_solicitante || 'Sin nombre'}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                <strong>Departamento:</strong>{' '}
                {solicitudSeleccionada.nombre_departamento ||
                  `Departamento #${solicitudSeleccionada.departamento_id}`}
              </p>

              <div className="text-sm text-gray-600 mt-2">
                <p>Fechas:</p>
                {formatearFechas(solicitudSeleccionada.fechas_vacaciones)}
              </div>

              <p className="text-sm text-gray-600 mt-2">
                <strong>Días:</strong>{' '}
                {solicitudSeleccionada.dias_solicitados}
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => setSolicitudSeleccionada(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={() =>
                  handleRechazar(solicitudSeleccionada.id)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Rechazar
              </button>

              <button
                onClick={() =>
                  handleAutorizar(solicitudSeleccionada.id)
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Autorizar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}