import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Calendar, LogOut, Plus, X, ChevronDown } from 'lucide-react';

interface EmpleadoDashboardProps {
  usuario: any;
  onLogout: () => void;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-indigo-50 transition-colors ${
                value === option ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmpleadoDashboard({ usuario, onLogout }: EmpleadoDashboardProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [numEmpleado, setNumEmpleado] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [diasDisponibles, setDiasDisponibles] = useState('');

  const departamentos = [
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

  const departamentosMap: Record<string, number> = {
    'CONTRALORIA': 1,
    'CUERPO EDILICIO': 2,
    'DIF MUNICIPAL': 3,
    'DELG V CARRANZA': 4,
    'DESARROLLO SOCIAL': 5,
    'FOMENTO ECONOMICO': 6,
    'FOMENTO DEPORTIVO': 7,
    'FOMENTO AGROPECUARIO': 8,
    'OBRAS PUBLICAS': 9,
    'COMUNICACIÓN': 10,
    'SECRETARIA DEL AYUNTAMIENTO': 11,
    'SEGURIDAD PUBLICA': 12,
    'TESORERIA': 13,
    'CATASTRO': 14,
    'SIMAS': 15,
    'ECOLOGÍA': 16,
    'PLANEACIÓN': 17,
    'CENTRO DE SALUD': 18,
    'SINDICALIA': 19,
    'JUZGADO': 20,
    'EDUCACIÓN': 21,
    'BOMBEROS': 22,
    'RECURSOS HUMANOS': 23,
    'TENENCIA': 24,
    'CASA DE LA CULTURA': 25,
    'LOGISTICA': 26,
    'ATENCION CIUDADANA': 27,
    'ATENCION A LA MUJER': 28,
    'INSPECTORES': 29,
    'ALCOLES Y TRANSPORTES': 30,
    'ALCOHOLES': 31,
    'BIENESTAR ANIMAL': 32,
    'IMAGEN URBANA': 33,
    'TI': 34,
    'NOTIFICADORES': 35,
  };

  const calcularDias = (dates: string[]) => dates.filter((date) => date).length;

  const limpiarFormulario = () => {
    setNumEmpleado('');
    setNombreCompleto('');
    setDepartamento('');
    setSelectedDates([]);
    setDiasDisponibles('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numEmpleado.trim()) {
      alert('Ingresa el número de empleado');
      return;
    }

    if (!nombreCompleto.trim()) {
      alert('Ingresa el nombre completo');
      return;
    }

    if (!departamento) {
      alert('Selecciona un departamento');
      return;
    }

    if (selectedDates.length === 0 || selectedDates.some((date) => !date)) {
      alert('Selecciona al menos un día de vacaciones válido');
      return;
    }

    const departamentoId = departamentosMap[departamento];

    if (!departamentoId) {
      alert('Departamento inválido');
      return;
    }

    const diasSolicitados = calcularDias(selectedDates);
    const diasDisp = parseInt(diasDisponibles);

    if (isNaN(diasDisp) || diasDisp <= 0) {
      alert('Por favor ingresa tus días disponibles');
      return;
    }

    if (diasSolicitados > diasDisp) {
      alert('No tienes suficientes días disponibles');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const empleadoId = usuario?.id;

      if (!token) {
        alert('Sesión expirada. Inicia sesión nuevamente.');
        return;
      }

      if (!empleadoId) {
        alert('No se encontró la cuenta de empleado. Inicia sesión nuevamente.');
        return;
      }

      await axios.post(
        'http://localhost:3000/api/solicitudes',
        {
          empleado_id: empleadoId,
          numero_empleado_solicitante: numEmpleado.trim(),
          nombre_completo_solicitante: nombreCompleto.trim(),
          departamento_id: departamentoId,
          dias_pendientes: diasDisp,
          dias_solicitados: diasSolicitados,
          fechas_vacaciones: selectedDates.join(', '),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Solicitud enviada');
      setMostrarFormulario(false);
      limpiarFormulario();
    } catch (error) {
      console.log(error);
      alert('Error al enviar solicitud');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal del Empleado</h1>
              <p className="text-sm text-gray-600">Solicitud de Vacaciones</p>
              <p className="text-sm text-gray-500">
                Bienvenido, {usuario?.nombre || 'Empleado'}
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

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Solicitar Vacaciones
            </h2>

            <p className="text-gray-600 mt-2">
              Completa el formulario para enviar tu solicitud
            </p>
          </div>

          <button
            onClick={() => {
              limpiarFormulario();
              setSelectedDates(['']);
              setMostrarFormulario(true);
            }}
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
              <li>• Tu solicitud será enviada al jefe del departamento seleccionado</li>
              <li>• Una vez autorizada, será procesada por Recursos Humanos</li>
            </ul>
          </div>
        </div>
      </main>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Formato de Solicitud de Vacaciones
              </h3>

              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  limpiarFormulario();
                }}
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
                <CustomSelect
                  value={departamento}
                  onChange={setDepartamento}
                  options={departamentos}
                  placeholder="Selecciona un departamento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Pendientes *
                </label>
                <input
                  type="number"
                  value={diasDisponibles}
                  onChange={(e) => setDiasDisponibles(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Número de días pendientes"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de Vacaciones *
                </label>

                <div className="space-y-3">
                  {selectedDates.map((date, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value && selectedDates.some((d, i) => d === value && i !== index)) {
                            alert('Ya seleccionaste esa fecha. Elige una fecha diferente.');
                            return;
                          }

                          setSelectedDates((prev) =>
                            prev.map((d, i) => (i === index ? value : d))
                          );
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDates((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSelectedDates((prev) => [...prev, ''])}
                    className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    Agregar día
                  </button>

                  {selectedDates.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Puedes seleccionar días sueltos; no es necesario que sean consecutivos.
                    </p>
                  )}
                </div>
              </div>

              {selectedDates.length > 0 && selectedDates.some((date) => date) && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-700">Días a solicitar:</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {calcularDias(selectedDates)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-700">Días disponibles:</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {diasDisponibles || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    limpiarFormulario();
                  }}
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