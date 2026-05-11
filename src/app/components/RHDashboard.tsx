import { useState } from 'react';
import { FileCheck, Download, Search, LogOut, Calendar } from 'lucide-react';

interface Solicitud {
  id: string;
  empleado: {
    numEmpleado: string;
    nombre: string;
    departamento: string;
  };
  jefe: {
    nombre: string;
  };
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFin: string;
  diasSolicitados: number;
  estatus: 'autorizado' | 'recibido';
  fechaAutorizacion: string;
  fechaRecepcion?: string;
  comentarios?: string;
}

interface RHDashboardProps {
  usuario: any;
  onLogout: () => void;
}

export default function RHDashboard({ usuario, onLogout }: RHDashboardProps) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    {
      id: '1',
      empleado: {
        numEmpleado: '1001',
        nombre: 'Juan Pérez',
        departamento: 'Ventas',
      },
      jefe: {
        nombre: 'María González',
      },
      fechaSolicitud: '2026-04-15',
      fechaInicio: '2026-04-25',
      fechaFin: '2026-04-30',
      diasSolicitados: 6,
      estatus: 'autorizado',
      fechaAutorizacion: '2026-04-16',
    },
    {
      id: '2',
      empleado: {
        numEmpleado: '1003',
        nombre: 'Luis Torres',
        departamento: 'Ventas',
      },
      jefe: {
        nombre: 'María González',
      },
      fechaSolicitud: '2026-03-20',
      fechaInicio: '2026-04-10',
      fechaFin: '2026-04-15',
      diasSolicitados: 6,
      estatus: 'recibido',
      fechaAutorizacion: '2026-03-21',
      fechaRecepcion: '2026-03-22',
    },
    {
      id: '3',
      empleado: {
        numEmpleado: '1005',
        nombre: 'Carmen López',
        departamento: 'Administración',
      },
      jefe: {
        nombre: 'Roberto Sánchez',
      },
      fechaSolicitud: '2026-04-18',
      fechaInicio: '2026-05-01',
      fechaFin: '2026-05-07',
      diasSolicitados: 7,
      estatus: 'autorizado',
      fechaAutorizacion: '2026-04-19',
    },
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState<'todos' | 'autorizado' | 'recibido'>('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  const [selectedSolicitudes, setSelectedSolicitudes] = useState<string[]>([]);

  const handleMarcarRecibido = (solicitudId: string) => {
    setSolicitudes(solicitudes.map(s =>
      s.id === solicitudId
        ? {
            ...s,
            estatus: 'recibido' as const,
            fechaRecepcion: new Date().toISOString().split('T')[0],
          }
        : s
    ));
    alert('Solicitud marcada como recibida y archivada en expediente digital');
  };

  const handleDescargarPDF = (solicitud: Solicitud) => {
    alert(`Descargando PDF de la solicitud de ${solicitud.empleado.nombre}...`);
  };

  const handleToggleSeleccion = (solicitudId: string) => {
    setSelectedSolicitudes((prev) =>
      prev.includes(solicitudId)
        ? prev.filter((id) => id !== solicitudId)
        : [...prev, solicitudId]
    );
  };

  const handleExportarPDF = () => {
    if (selectedSolicitudes.length === 0) {
      alert('Selecciona al menos una solicitud para exportar a PDF.');
      return;
    }

    const solicitudesSeleccionadas = solicitudes.filter((solicitud) =>
      selectedSolicitudes.includes(solicitud.id)
    );

    alert(
      `Exportando ${solicitudesSeleccionadas.length} solicitud(es) a PDF: \n` +
      solicitudesSeleccionadas.map((solicitud) => `${solicitud.empleado.nombre} (${solicitud.id})`).join('\n')
    );
  };

  const departamentos = [
    'todos',
    'CONTRALORIA',
    'CUERPO EDILICIO',
    'DIF MUNICIPAL',
    'DELG V CARRANZA',
    'DESARROLLO SOCIAL',
    'FOMENTO ECONOMICO',
    'FOMENTO DEPORTIVO',
    'FOMENTO AGROPECUARIO',
    'OBRAS PUBLICAS',
    'COMUNICACIÓN',
    'SECRETARIA DEL AYUNTAMIENTO',
    'SEGURIDAD PUBLICA',
    'TESORERIA',
    'CATASTRO',
    'SIMAS',
    'ECOLOGÍA',
    'PLANEACIÓN',
    'CENTRO DE SALUD',
    'SINDICALIA',
    'JUZGADO',
    'EDUCACIÓN',
    'BOMBEROS',
    'RECURSOS HUMANOS',
    'TENENCIA',
    'CASA DE LA CULTURA',
    'LOGISTICA',
    'ATENCION CIUDADANA',
    'ATENCION A LA MUJER',
    'INSPECTORES',
    'ALCOLES Y TRANSPORTES',
    'ALCOHOLES',
    'BIENESTAR ANIMAL',
    'IMAGEN URBANA',
    'TI',
    'NOTIFICADORES',
  ];

  const solicitudesFiltradas = solicitudes.filter(s => {
    const coincideBusqueda = s.empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            s.empleado.numEmpleado.includes(busqueda);
    const coincideEstatus = filtroEstatus === 'todos' || s.estatus === filtroEstatus;
    const coincideDepartamento = filtroDepartamento === 'todos' || s.empleado.departamento === filtroDepartamento;

    return coincideBusqueda && coincideEstatus && coincideDepartamento;
  });

  const autorizadas = solicitudes.filter(s => s.estatus === 'autorizado').length;
  const recibidas = solicitudes.filter(s => s.estatus === 'recibido').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal de Recursos Humanos</h1>
              <p className="text-sm text-gray-600">{usuario.nombre} - Control de Vacaciones</p>
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
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes de Recibir</p>
                <p className="text-2xl font-bold text-gray-900">{autorizadas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recibidas</p>
                <p className="text-2xl font-bold text-gray-900">{recibidas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Solicitudes</p>
                <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Gestión de Solicitudes</h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o número..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <select
                  value={filtroDepartamento}
                  onChange={(e) => setFiltroDepartamento(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {departamentos.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'todos' ? 'Todos los departamentos' : dept}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExportarPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Exportar PDF
                </button>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {selectedSolicitudes.length > 0
                  ? `${selectedSolicitudes.length} solicitud(es) seleccionada(s)`
                  : 'Selecciona las solicitudes que quieras exportar.'}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {(['todos', 'autorizado', 'recibido'] as const).map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstatus(estado)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filtroEstatus === estado
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {estado === 'todos' ? 'Todas' : estado.charAt(0).toUpperCase() + estado.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {solicitudesFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No se encontraron solicitudes</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seleccionar</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Empleado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jefe Autorizador</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estatus</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {solicitudesFiltradas.map((solicitud) => (
                      <tr key={solicitud.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSolicitudes.includes(solicitud.id)}
                            onChange={() => handleToggleSeleccion(solicitud.id)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {solicitud.empleado.numEmpleado}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {solicitud.empleado.nombre}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {solicitud.empleado.departamento}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div>{solicitud.fechaInicio}</div>
                          <div>al {solicitud.fechaFin}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                          {solicitud.diasSolicitados}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {solicitud.jefe.nombre}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            solicitud.estatus === 'autorizado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {solicitud.estatus === 'autorizado' ? 'Autorizado' : 'Recibido'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDescargarPDF(solicitud)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Descargar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {solicitud.estatus === 'autorizado' && (
                              <button
                                onClick={() => handleMarcarRecibido(solicitud.id)}
                                className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors"
                              >
                                Marcar Recibido
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas del Mes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">
                {solicitudes.reduce((sum, s) => sum + s.diasSolicitados, 0)}
              </p>
              <p className="text-sm text-gray-600">Días Totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{autorizadas}</p>
              <p className="text-sm text-gray-600">Por Recibir</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{recibidas}</p>
              <p className="text-sm text-gray-600">Recibidas</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{departamentos.length - 1}</p>
              <p className="text-sm text-gray-600">Departamentos</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
