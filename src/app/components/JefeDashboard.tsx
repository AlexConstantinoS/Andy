import { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, LogOut, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface Solicitud {
  id: string;
  empleado: {
    numEmpleado: string;
    nombre: string;
    departamento: string;
  };
  fechaSolicitud: string;
  fechasSolicitadas: string[];
  diasSolicitados: number;
  estatus: 'pendiente' | 'autorizado' | 'rechazado';
  comentarios?: string;
  fechaAutorizacion?: string;
}

interface JefeDashboardProps {
  usuario: any;
  onLogout: () => void;
}

export default function JefeDashboard({ usuario, onLogout }: JefeDashboardProps) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    {
      id: '1',
      empleado: {
        numEmpleado: '1001',
        nombre: 'Juan Pérez',
        departamento: 'Ventas',
      },
      fechaSolicitud: '2026-04-18',
      fechasSolicitadas: ['2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29', '2026-04-30'],
      diasSolicitados: 6,
      estatus: 'pendiente',
    },
    {
      id: '2',
      empleado: {
        numEmpleado: '1002',
        nombre: 'Ana Martínez',
        departamento: 'Ventas',
      },
      fechaSolicitud: '2026-04-15',
      fechasSolicitadas: ['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05'],
      diasSolicitados: 5,
      estatus: 'pendiente',
    },
    {
      id: '3',
      empleado: {
        numEmpleado: '1003',
        nombre: 'Luis Torres',
        departamento: 'Ventas',
      },
      fechaSolicitud: '2026-03-20',
      fechasSolicitadas: ['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14', '2026-04-15'],
      diasSolicitados: 6,
      estatus: 'autorizado',
      fechaAutorizacion: '2026-03-21',
    },
  ]);

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'autorizado' | 'rechazado'>('todas');

  const handleAutorizar = (solicitudId: string) => {
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud) return;

    const fechaAutorizacion = new Date().toISOString().split('T')[0];
    const solicitudActualizada = {
      ...solicitud,
      estatus: 'autorizado' as const,
      fechaAutorizacion
    };

    setSolicitudes(solicitudes.map(s =>
      s.id === solicitudId ? solicitudActualizada : s
    ));

    descargarPDF(solicitudActualizada);

    setSolicitudSeleccionada(null);
    alert('Solicitud autorizada correctamente. PDF descargado.');
  };

  const handleRechazar = (solicitudId: string) => {
    setSolicitudes(solicitudes.map(s =>
      s.id === solicitudId
        ? {
            ...s,
            estatus: 'rechazado' as const,
            fechaAutorizacion: new Date().toISOString().split('T')[0]
          }
        : s
    ));
    setSolicitudSeleccionada(null);
    alert('Solicitud rechazada');
  };

  const descargarPDF = (solicitud: Solicitud) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Autorización de Vacaciones', 20, 30);

    doc.setFontSize(12);
    doc.text(`Empleado: ${solicitud.empleado.nombre}`, 20, 50);
    doc.text(`Número de Empleado: ${solicitud.empleado.numEmpleado}`, 20, 60);
    doc.text(`Departamento: ${solicitud.empleado.departamento}`, 20, 70);

    doc.text('Fechas solicitadas:', 20, 90);
    solicitud.fechasSolicitadas.forEach((fecha, index) => {
      doc.text(`- ${fecha}`, 30, 100 + (index * 10));
    });

    const yPos = 100 + (solicitud.fechasSolicitadas.length * 10) + 10;
    doc.text(`Días solicitados: ${solicitud.diasSolicitados}`, 20, yPos);
    doc.text(`Fecha de autorización: ${solicitud.fechaAutorizacion || new Date().toLocaleDateString('es-MX')}`, 20, yPos + 10);

    doc.text('_______________________________', 20, yPos + 30);
    doc.text('Firma del Jefe', 20, yPos + 40);

    doc.save(`autorizacion-vacaciones-${solicitud.empleado.numEmpleado}.pdf`);
  };

  const solicitudesFiltradas = filtro === 'todas'
    ? solicitudes
    : solicitudes.filter(s => s.estatus === filtro);

  const pendientes = solicitudes.filter(s => s.estatus === 'pendiente').length;
  const autorizadas = solicitudes.filter(s => s.estatus === 'autorizado').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal del Jefe</h1>
              <p className="text-sm text-gray-600">{usuario.nombre} - {usuario.departamento}</p>
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
                <p className="text-sm text-gray-600">Pendientes de Autorizar</p>
                <p className="text-2xl font-bold text-gray-900">{pendientes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Autorizadas</p>
                <p className="text-2xl font-bold text-gray-900">{autorizadas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Solicitudes</p>
                <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Solicitudes de Vacaciones</h2>
              <div className="flex gap-2">
                {(['todas', 'pendiente', 'autorizado', 'rechazado'] as const).map((estado) => (
                  <button
                    key={estado}
                    onClick={() => setFiltro(estado)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filtro === estado
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {solicitudesFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay solicitudes {filtro !== 'todas' ? filtro + 's' : ''}</p>
            ) : (
              <div className="space-y-4">
                {solicitudesFiltradas.map((solicitud) => (
                  <div key={solicitud.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{solicitud.empleado.nombre}</p>
                        <p className="text-sm text-gray-600">No. Empleado: {solicitud.empleado.numEmpleado}</p>
                        <p className="text-sm text-gray-600">{solicitud.empleado.departamento}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        solicitud.estatus === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        solicitud.estatus === 'autorizado' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {solicitud.estatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">Fechas solicitadas:</p>
                        <div className="space-y-1 font-medium text-gray-900">
                          {solicitud.fechasSolicitadas.map((fecha) => (
                            <p key={fecha}>{fecha}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Días solicitados:</p>
                        <p className="font-medium">{solicitud.diasSolicitados} días</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Fecha de solicitud: {solicitud.fechaSolicitud}
                    </p>

                    {solicitud.comentarios && (
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="text-xs text-gray-600 font-medium">Comentarios:</p>
                        <p className="text-sm text-gray-700">{solicitud.comentarios}</p>
                      </div>
                    )}

                    {solicitud.estatus === 'pendiente' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setSolicitudSeleccionada(solicitud)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Autorizar
                        </button>
                        <button
                          onClick={() => setSolicitudSeleccionada(solicitud)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </div>
                    )}

                    {solicitud.estatus === 'autorizado' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => descargarPDF(solicitud)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Descargar PDF
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
              {solicitudSeleccionada.estatus === 'pendiente' ? 'Revisar Solicitud' : 'Rechazar Solicitud'}
            </h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{solicitudSeleccionada.empleado.nombre}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Fechas solicitadas:</p>
                <div className="pl-2">
                  {solicitudSeleccionada.fechasSolicitadas.map((fecha) => (
                    <p key={fecha}>{fecha}</p>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{solicitudSeleccionada.diasSolicitados} días solicitados</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSolicitudSeleccionada(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRechazar(solicitudSeleccionada.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={() => handleAutorizar(solicitudSeleccionada.id)}
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
