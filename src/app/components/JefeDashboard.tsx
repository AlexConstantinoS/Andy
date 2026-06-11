import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  CheckCircle,
  Clock,
  LogOut,
  XCircle,
  CalendarDays,
  Building2,
  Hash,
  User,
  ClipboardCheck,
  Eye,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface JefeDashboardProps {
  usuario: any;
  onLogout: () => void;
}

type EstadoFiltro = 'todas' | 'pendiente' | 'aceptada_jefe' | 'rechazada';

export default function JefeDashboard({
  usuario,
  onLogout,
}: JefeDashboardProps) {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<any>(null);
  const [cargando, setCargando] = useState(false);

  const [filtro, setFiltro] = useState<EstadoFiltro>('todas');

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const obtenerSolicitudes = async () => {
    try {
      setCargando(true);

      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/solicitudes/jefe`,
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
    } finally {
      setCargando(false);
    }
  };

  const handleAutorizar = async (solicitudId: number) => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/solicitudes/${solicitudId}`,
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
        `${import.meta.env.VITE_API_URL}/api/solicitudes/${solicitudId}`,
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

  const parseFechaLocal = (fecha: string) => {
    const limpia = fecha.trim().split('T')[0];

    if (!limpia.includes('-')) {
      return new Date(fecha);
    }

    const [year, month, day] = limpia.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Sin fecha';

    return parseFechaLocal(fecha).toLocaleDateString('es-MX');
  };

  const formatearFechas = (fechas: any) => {
    if (Array.isArray(fechas)) {
      return fechas.map((fecha: string, index: number) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-100"
        >
          {formatearFecha(fecha)}
        </span>
      ));
    }

    if (typeof fechas === 'string') {
      return fechas
        .split(',')
        .map((fecha) => fecha.trim())
        .filter(Boolean)
        .map((fecha, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-100"
          >
            {formatearFecha(fecha)}
          </span>
        ));
    }

    return (
      <span className="text-sm text-gray-500">
        Sin fechas
      </span>
    );
  };

  const obtenerTextoEstado = (estado: string) => {
    if (estado === 'pendiente') return 'Pendiente';
    if (estado === 'aceptada_jefe') return 'Autorizada';
    if (estado === 'rechazada') return 'Rechazada';
    return estado;
  };

  const obtenerClaseEstado = (estado: string) => {
    if (estado === 'pendiente') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }

    if (estado === 'aceptada_jefe') {
      return 'bg-green-100 text-green-800 border-green-200';
    }

    if (estado === 'rechazada') {
      return 'bg-red-100 text-red-800 border-red-200';
    }

    return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const rechazadas = solicitudes.filter(
    (s) => s.estado === 'rechazada'
  ).length;

  const totalDiasPendientes = solicitudes
    .filter((s) => s.estado === 'pendiente')
    .reduce((sum, s) => sum + Number(s.dias_solicitados || 0), 0);

  const filtros: { label: string; value: EstadoFiltro }[] = [
    { label: 'Todas', value: 'todas' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Autorizadas', value: 'aceptada_jefe' },
    { label: 'Rechazadas', value: 'rechazada' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-teal-50">
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <img
                  src="/img/escudo-nava.png"
                  alt="Escudo Nava"
                  className="w-12 h-12 object-contain"
                />
                <img
                  src="/img/logo-nava.png"
                  alt="Logo Nava"
                  className="w-20 h-12 object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Portal del Director de Departamento
                </h1>
                <p className="text-sm text-gray-600">
                  Gestión de solicitudes de vacaciones
                </p>
                <p className="text-xs text-gray-500">
                  {usuario?.nombre || 'Jefe de departamento'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={obtenerSolicitudes}
                disabled={cargando}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 rounded-xl transition-colors disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
                Actualizar
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-900 text-white shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex sm:hidden items-center gap-3 mb-6">
                <img
                  src="/img/escudo-nava.png"
                  alt="Escudo Nava"
                  className="w-16 h-16 object-contain bg-white rounded-2xl p-2"
                />
                <img
                  src="/img/logo-nava.png"
                  alt="Logo Nava"
                  className="w-24 h-16 object-contain bg-white rounded-2xl p-2"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 border border-white/20 rounded-full text-sm mb-5">
                <ClipboardCheck className="w-4 h-4" />
                Revisión por departamento
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Autoriza o rechaza solicitudes de vacaciones
              </h2>

              <p className="text-white/90 text-base sm:text-lg max-w-xl">
                Aquí aparecen únicamente las solicitudes del departamento
                asignado a tu cuenta de jefe.
              </p>
            </div>

            <div className="bg-white/12 border border-white/20 rounded-3xl p-6 backdrop-blur">
              <h3 className="font-bold text-lg mb-4">
                Resumen rápido
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Pendientes</p>
                  <p className="text-3xl font-extrabold">{pendientes}</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Días por revisar</p>
                  <p className="text-3xl font-extrabold">{totalDiasPendientes}</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Autorizadas</p>
                  <p className="text-3xl font-extrabold">{autorizadas}</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Rechazadas</p>
                  <p className="text-3xl font-extrabold">{rechazadas}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-2xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Pendientes
                </p>

                <p className="text-2xl font-extrabold text-gray-900">
                  {pendientes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-2xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Autorizadas
                </p>

                <p className="text-2xl font-extrabold text-gray-900">
                  {autorizadas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-2xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Rechazadas
                </p>

                <p className="text-2xl font-extrabold text-gray-900">
                  {rechazadas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Total
                </p>

                <p className="text-2xl font-extrabold text-gray-900">
                  {solicitudes.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Solicitudes de Vacaciones
                </h2>
                <p className="text-sm text-gray-500">
                  Revisa las solicitudes pendientes y consulta el historial del departamento.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {filtros.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFiltro(item.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      filtro === item.value
                        ? 'bg-teal-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {cargando ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mb-3 text-teal-700" />
                <p>Cargando solicitudes...</p>
              </div>
            ) : solicitudesFiltradas.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">
                  No hay solicitudes
                </p>
                <p className="text-sm text-gray-500">
                  No se encontraron solicitudes para el filtro seleccionado.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {solicitudesFiltradas.map((solicitud) => (
                  <article
                    key={solicitud.id}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                          <User className="w-6 h-6 text-teal-700" />
                        </div>

                        <div>
                          <p className="font-bold text-gray-900">
                            {solicitud.nombre_completo_solicitante || 'Sin nombre'}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                              <Hash className="w-3 h-3" />
                              {solicitud.numero_empleado_solicitante || 'Sin número'}
                            </span>

                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-full text-xs text-blue-700 border border-blue-100">
                              <Building2 className="w-3 h-3" />
                              {solicitud.nombre_departamento ||
                                `Departamento #${solicitud.departamento_id}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${obtenerClaseEstado(
                          solicitud.estado
                        )}`}
                      >
                        {obtenerTextoEstado(solicitud.estado)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Días solicitados
                        </p>
                        <p className="text-2xl font-extrabold text-gray-900">
                          {solicitud.dias_solicitados}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Días pendientes
                        </p>
                        <p className="text-2xl font-extrabold text-gray-900">
                          {solicitud.dias_pendientes}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Restantes
                        </p>
                        <p className="text-2xl font-extrabold text-teal-700">
                          {Number(solicitud.dias_pendientes || 0) -
                            Number(solicitud.dias_solicitados || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-teal-700" />
                        Fechas solicitadas
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {formatearFechas(solicitud.fechas_vacaciones)}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Fecha solicitud:{' '}
                        <span className="font-semibold text-gray-700">
                          {formatearFecha(solicitud.fecha_solicitud)}
                        </span>
                      </p>

                      {solicitud.estado === 'pendiente' ? (
                        <button
                          onClick={() => setSolicitudSeleccionada(solicitud)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-bold shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          Revisar solicitud
                        </button>
                      ) : (
                        <div className="text-xs text-gray-500">
                          {solicitud.respuesta_jefe || obtenerTextoEstado(solicitud.estado)}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {solicitudSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white px-6 py-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold">
                    Revisar Solicitud
                  </h3>
                  <p className="text-sm text-white/80">
                    Autoriza o rechaza la solicitud seleccionada.
                  </p>
                </div>

                <button
                  onClick={() => setSolicitudSeleccionada(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/15 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-teal-700" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Empleado solicitante
                    </p>
                    <p className="font-bold text-gray-900">
                      {solicitudSeleccionada.nombre_completo_solicitante || 'Sin nombre'}
                    </p>
                    <p className="text-sm text-gray-600">
                      No. empleado:{' '}
                      <span className="font-semibold">
                        {solicitudSeleccionada.numero_empleado_solicitante || 'Sin número'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-gray-500 mb-1">Departamento</p>
                    <p className="font-bold text-gray-900">
                      {solicitudSeleccionada.nombre_departamento ||
                        `Departamento #${solicitudSeleccionada.departamento_id}`}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-gray-500 mb-1">Días solicitados</p>
                    <p className="font-bold text-gray-900">
                      {solicitudSeleccionada.dias_solicitados}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-gray-500 mb-2">Fechas</p>
                    <div className="flex flex-wrap gap-2">
                      {formatearFechas(solicitudSeleccionada.fechas_vacaciones)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-gray-500 mb-1">Días restantes</p>
                    <p className="font-bold text-teal-700">
                      {Number(solicitudSeleccionada.dias_pendientes || 0) -
                        Number(solicitudSeleccionada.dias_solicitados || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-5">
                <p className="text-sm text-yellow-800">
                  Al autorizar, la solicitud pasará automáticamente al portal de Recursos Humanos.
                  Al rechazar, quedará registrada como rechazada.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSolicitudSeleccionada(null)}
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => handleRechazar(solicitudSeleccionada.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold shadow-md"
                >
                  <XCircle className="w-5 h-5" />
                  Rechazar
                </button>

                <button
                  onClick={() => handleAutorizar(solicitudSeleccionada.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors font-bold shadow-md"
                >
                  <CheckCircle className="w-5 h-5" />
                  Autorizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}