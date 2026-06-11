import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  LogOut,
  Plus,
  X,
  ChevronDown,
  User,
  Building2,
  Hash,
  FileText,
  Send,
  Trash2,
  Info,
  CheckCircle,
} from 'lucide-react';

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
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 bg-white text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors ${
                value === option
                  ? 'bg-teal-100 text-teal-800 font-semibold'
                  : 'text-gray-800'
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
    CONTRALORIA: 1,
    'CUERPO EDILICIO': 2,
    'DIF MUNICIPAL': 3,
    'DELG V CARRANZA': 4,
    'DESARROLLO SOCIAL': 5,
    'FOMENTO ECONOMICO': 6,
    'FOMENTO DEPORTIVO': 7,
    'FOMENTO AGROPECUARIO': 8,
    'OBRAS PUBLICAS': 9,
    COMUNICACIÓN: 10,
    'SECRETARIA DEL AYUNTAMIENTO': 11,
    'SEGURIDAD PUBLICA': 12,
    TESORERIA: 13,
    CATASTRO: 14,
    SIMAS: 15,
    ECOLOGÍA: 16,
    PLANEACIÓN: 17,
    'CENTRO DE SALUD': 18,
    SINDICALIA: 19,
    JUZGADO: 20,
    EDUCACIÓN: 21,
    BOMBEROS: 22,
    'RECURSOS HUMANOS': 23,
    TENENCIA: 24,
    'CASA DE LA CULTURA': 25,
    LOGISTICA: 26,
    'ATENCION CIUDADANA': 27,
    'ATENCION A LA MUJER': 28,
    INSPECTORES: 29,
    'ALCOLES Y TRANSPORTES': 30,
    ALCOHOLES: 31,
    'BIENESTAR ANIMAL': 32,
    'IMAGEN URBANA': 33,
    TI: 34,
    NOTIFICADORES: 35,
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
        `${import.meta.env.VITE_API_URL}/api/solicitudes`,
        {
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

  const diasSolicitadosActuales = calcularDias(selectedDates);
  const diasRestantes =
    diasDisponibles && !isNaN(Number(diasDisponibles))
      ? Number(diasDisponibles) - diasSolicitadosActuales
      : 0;

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
                  Portal del Empleado
                </h1>
                <p className="text-sm text-gray-600">
                  Solicitud de Vacaciones
                </p>
                <p className="text-xs text-gray-500">
                  Bienvenido, {usuario?.nombre || 'Empleado'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
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
                <CheckCircle className="w-4 h-4" />
                Sistema Municipal de Vacaciones
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Solicita tus vacaciones de forma rápida y ordenada
              </h2>

              <p className="text-white/90 text-base sm:text-lg max-w-xl">
                Llena el formato digital y tu solicitud será enviada
                automáticamente al jefe del departamento seleccionado.
              </p>

              <button
                onClick={() => {
                  limpiarFormulario();
                  setSelectedDates(['']);
                  setMostrarFormulario(true);
                }}
                className="mt-7 inline-flex items-center gap-3 px-6 py-3 bg-white text-teal-800 font-bold rounded-2xl hover:bg-teal-50 transition shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Crear Nueva Solicitud
              </button>
            </div>

            <div className="bg-white/12 border border-white/20 rounded-3xl p-6 backdrop-blur">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Antes de enviar
              </h3>

              <div className="space-y-3 text-sm text-white/90">
                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    1
                  </span>
                  <p>Escribe tu número de empleado y nombre completo.</p>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    2
                  </span>
                  <p>Selecciona el departamento correcto.</p>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    3
                  </span>
                  <p>Agrega los días de vacaciones que deseas solicitar.</p>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    4
                  </span>
                  <p>Recursos Humanos podrá descargar el PDF una vez autorizado por el jefe.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-teal-700" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Formato digital</h3>
            <p className="text-sm text-gray-600">
              Captura la información necesaria sin hojas físicas.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Envío por departamento</h3>
            <p className="text-sm text-gray-600">
              La solicitud llega al jefe del departamento seleccionado.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Fechas flexibles</h3>
            <p className="text-sm text-gray-600">
              Puedes seleccionar días sueltos sin que sean consecutivos.
            </p>
          </div>
        </section>
      </main>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-3xl px-6 py-5 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Formato de Solicitud de Vacaciones
                  </h3>
                  <p className="text-sm text-gray-500">
                    Completa la información del empleado solicitante
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    limpiarFormulario();
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-700" />
                  Datos del solicitante
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Solicitud
                    </label>
                    <input
                      type="text"
                      value={new Date().toLocaleDateString('es-MX')}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Empleado *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={numEmpleado}
                        onChange={(e) => setNumEmpleado(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                        placeholder="Ej: 1001"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                        placeholder="Nombre completo del empleado"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento *
                    </label>
                    <CustomSelect
                      value={departamento}
                      onChange={setDepartamento}
                      options={departamentos}
                      placeholder="Selecciona un departamento"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-700" />
                  Días y fechas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Días Pendientes *
                    </label>
                    <input
                      type="number"
                      value={diasDisponibles}
                      onChange={(e) => setDiasDisponibles(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                      placeholder="Número de días pendientes"
                      min="1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-teal-50 border border-teal-100 p-4">
                      <p className="text-xs text-gray-600">Días a solicitar</p>
                      <p className="text-2xl font-extrabold text-teal-700">
                        {diasSolicitadosActuales}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-4 ${
                        diasRestantes < 0
                          ? 'bg-red-50 border-red-100'
                          : 'bg-emerald-50 border-emerald-100'
                      }`}
                    >
                      <p className="text-xs text-gray-600">Restantes</p>
                      <p
                        className={`text-2xl font-extrabold ${
                          diasRestantes < 0 ? 'text-red-700' : 'text-emerald-700'
                        }`}
                      >
                        {diasDisponibles ? diasRestantes : 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedDates.map((date, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3">
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
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDates((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSelectedDates((prev) => [...prev, ''])}
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-teal-800 bg-teal-50 border border-teal-100 rounded-xl hover:bg-teal-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar día
                  </button>

                  <p className="text-sm text-gray-500">
                    Puedes seleccionar días sueltos; no es necesario que sean consecutivos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    limpiarFormulario();
                  }}
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors font-bold shadow-lg"
                >
                  <Send className="w-5 h-5" />
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