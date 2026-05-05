import { useState } from 'react';
import { Calendar, LogOut, Plus, X } from 'lucide-react';

interface EmpleadoDashboardProps {
  usuario: any;
  onLogout: () => void;
}

export default function EmpleadoDashboard({ usuario, onLogout }: EmpleadoDashboardProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [numEmpleado, setNumEmpleado] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [diasDisponibles, setDiasDisponibles] = useState('');

  const departamentos = [
    'Ventas',
    'Administración',
    'Marketing',
    'Recursos Humanos',
    'Finanzas',
    'Operaciones',
    'TI',
  ];

  const calcularDias = (inicio: string, fin: string) => {
    if (!inicio || !fin) return 0;
    const date1 = new Date(inicio);
    const date2 = new Date(fin);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const diasSolicitados = calcularDias(fechaInicio, fechaFin);
    const diasDisp = parseInt(diasDisponibles);

    if (isNaN(diasDisp) || diasDisp <= 0) {
      alert('Por favor ingresa tus días disponibles');
      return;
    }

    if (diasSolicitados > diasDisp) {
      alert('No tienes suficientes días disponibles');
      return;
    }

    // Aquí se enviará la solicitud a Supabase
    alert(`Solicitud enviada correctamente!\n\nEmpleado: ${nombreCompleto}\nDepartamento: ${departamento}\nPeriodo: ${fechaInicio} al ${fechaFin}\nDías: ${diasSolicitados}`);

    setMostrarFormulario(false);
    setNumEmpleado('');
    setNombreCompleto('');
    setDepartamento('');
    setFechaInicio('');
    setFechaFin('');
    setDiasDisponibles('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal del Empleado</h1>
              <p className="text-sm text-gray-600">Solicitud de Vacaciones</p>
              <p className="text-sm text-gray-500">Bienvenido, {usuario?.nombre || 'Empleado'}</p>
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

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Solicitar Vacaciones</h2>
            <p className="text-gray-600 mt-2">Completa el formulario para enviar tu solicitud</p>
          </div>

          <button
            onClick={() => setMostrarFormulario(true)}
            className="w-full flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
            <span className="text-lg font-medium text-gray-600 group-hover:text-indigo-600">
              Crear Nueva Solicitud
            </span>
          </button>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Instrucciones:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Completa todos los campos del formulario</li>
              <li>• Asegúrate de tener días disponibles suficientes</li>
              <li>• Tu solicitud será enviada a tu jefe para autorización</li>
              <li>• Una vez autorizada, será procesada por Recursos Humanos</li>
            </ul>
          </div>
        </div>
      </main>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Formato de Solicitud de Vacaciones</h3>
              <button
                onClick={() => setMostrarFormulario(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Solicitud
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString('es-MX')}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Empleado *
                  </label>
                  <input
                    type="text"
                    value={numEmpleado}
                    onChange={(e) => setNumEmpleado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ej: 1001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre completo del empleado"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                >
                  <option value="" disabled>
                    Selecciona un departamento
                  </option>
                  {departamentos.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Disponibles *
                </label>
                <input
                  type="number"
                  value={diasDisponibles}
                  onChange={(e) => setDiasDisponibles(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Número de días disponibles"
                  min="1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                    min={fechaInicio || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {fechaInicio && fechaFin && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-700">Días a solicitar:</p>
                      <p className="text-2xl font-bold text-indigo-600">{calcularDias(fechaInicio, fechaFin)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Días disponibles:</p>
                      <p className="text-2xl font-bold text-gray-900">{diasDisponibles || '0'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
