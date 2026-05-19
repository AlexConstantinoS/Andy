import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import {
  FileCheck,
  Download,
  Search,
  LogOut,
  Calendar,
  Building2,
  Hash,
  User,
  Filter,
  RefreshCw,
  FileText,
  CheckCircle,
} from 'lucide-react';

interface Solicitud {
  id: number;
  empleado_id: number;
  numero_empleado_solicitante: string;
  nombre_completo_solicitante: string;
  departamento_id: number;
  nombre_departamento: string;
  fecha_solicitud: string;
  dias_pendientes: number;
  dias_solicitados: number;
  fechas_vacaciones: string;
  estado: 'aceptada_jefe';
  respuesta_jefe?: string;
  fecha_respuesta?: string;
  jefe_autoriza?: string;
  puesto_jefe_autoriza?: string;
}

interface RHDashboardProps {
  usuario: any;
  onLogout: () => void;
}

export default function RHDashboard({ usuario, onLogout }: RHDashboardProps) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  const [selectedSolicitudes, setSelectedSolicitudes] = useState<number[]>([]);
  const [cargando, setCargando] = useState(false);

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

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const obtenerSolicitudes = async () => {
    try {
      setCargando(true);

      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:3000/api/solicitudes/rh',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSolicitudes(response.data);
    } catch (error) {
      console.log(error);
      alert('Error al obtener solicitudes de Recursos Humanos');
    } finally {
      setCargando(false);
    }
  };

  const cargarImagenBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`No se pudo cargar la imagen: ${url}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
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

  const formatearFechaLarga = (fecha: string) => {
    if (!fecha) return 'Sin fecha';

    return parseFechaLocal(fecha).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const obtenerFechasArray = (fechasTexto: string) => {
    if (!fechasTexto) return [];

    return fechasTexto
      .split(',')
      .map((fecha) => fecha.trim())
      .filter(Boolean)
      .sort();
  };

  const obtenerFechaPresentacion = (fechasTexto: string) => {
    const fechas = obtenerFechasArray(fechasTexto);

    if (fechas.length === 0) {
      return 'Sin fecha';
    }

    const ultimaFecha = fechas[fechas.length - 1];
    const fechaPresentacion = parseFechaLocal(ultimaFecha);

    fechaPresentacion.setDate(fechaPresentacion.getDate() + 1);

    return fechaPresentacion.toLocaleDateString('es-MX');
  };

  const dibujarDecoracion = (doc: jsPDF) => {
    doc.setFillColor(171, 36, 87);
    doc.triangle(160, 0, 216, 0, 216, 18, 'F');

    doc.setFillColor(0, 137, 123);
    doc.triangle(185, 0, 216, 0, 216, 12, 'F');

    doc.setFillColor(212, 199, 170);
    doc.triangle(190, 0, 216, 0, 216, 28, 'F');

    doc.setFillColor(212, 199, 170);
    doc.triangle(0, 245, 0, 279, 42, 279, 'F');

    doc.setFillColor(0, 137, 123);
    doc.triangle(0, 255, 0, 279, 58, 279, 'F');

    doc.setFillColor(171, 36, 87);
    doc.triangle(0, 268, 0, 279, 75, 279, 'F');
  };

  const dibujarEncabezado = (
    doc: jsPDF,
    escudoNava: string,
    logoNava: string
  ) => {
    dibujarDecoracion(doc);

    doc.addImage(escudoNava, 'PNG', 17, 19, 25, 25);
    doc.addImage(logoNava, 'PNG', 152, 14, 38, 35);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(15);

    doc.text('Gobierno Municipal de Nava,', 108, 25, {
      align: 'center',
    });
    doc.text('Coahuila de Zaragoza', 108, 33, {
      align: 'center',
    });
    doc.text('Administración 2025 - 2027', 108, 41, {
      align: 'center',
    });
  };

  const dibujarPiePagina = (doc: jsPDF) => {
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const textX = 124;
    const iconX = 183;

    const y1 = 254;
    const y2 = 260;
    const y3 = 266;

    doc.text('Ignacio Zaragoza 105 Sur, Centro Nava, CP. 26170', textX, y1, {
      align: 'center',
    });

    doc.text('862 624 5251 (Ext. 130)', textX, y2, {
      align: 'center',
    });

    doc.text('recursoshumanos_nava@hotmail.com', textX, y3, {
      align: 'center',
    });

    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(0, 0, 0);
    doc.setLineWidth(0.5);

    doc.circle(iconX, y1 - 2, 1.8, 'S');
    doc.circle(iconX, y1 - 2, 0.6, 'F');
    doc.triangle(
      iconX - 1.2,
      y1 - 0.7,
      iconX + 1.2,
      y1 - 0.7,
      iconX,
      y1 + 2,
      'F'
    );

    doc.setLineWidth(0.7);
    doc.line(iconX - 2, y2 - 2.5, iconX - 1, y2 - 1.5);
    doc.line(iconX - 1, y2 - 1.5, iconX - 1.5, y2 - 0.6);
    doc.line(iconX - 1.5, y2 - 0.6, iconX + 0.3, y2 + 1.2);
    doc.line(iconX + 0.3, y2 + 1.2, iconX + 1.2, y2 + 0.7);
    doc.line(iconX + 1.2, y2 + 0.7, iconX + 2.2, y2 + 1.7);

    doc.setLineWidth(0.5);
    doc.rect(iconX - 2.8, y3 - 3.2, 5.6, 4, 'S');
    doc.line(iconX - 2.8, y3 - 3.2, iconX, y3 - 1);
    doc.line(iconX + 2.8, y3 - 3.2, iconX, y3 - 1);
    doc.line(iconX - 2.8, y3 + 0.8, iconX - 0.5, y3 - 1.1);
    doc.line(iconX + 2.8, y3 + 0.8, iconX + 0.5, y3 - 1.1);
  };

  const dibujarContenidoSolicitud = (
    doc: jsPDF,
    solicitud: Solicitud,
    escudoNava: string,
    logoNava: string
  ) => {
    dibujarEncabezado(doc, escudoNava, logoNava);

    const fechaElaboracion = new Date().toLocaleDateString('es-MX');

    const nombreEmpleado =
      solicitud.nombre_completo_solicitante || 'NOMBRE DEL EMPLEADO';

    const numeroEmpleado =
      solicitud.numero_empleado_solicitante || 'NUMERO DE EMPLEADO';

    const puestoEmpleado = solicitud.nombre_departamento || 'PUESTO';

    const diasSolicitados = Number(solicitud.dias_solicitados || 0);

    const diasRestantes =
      Number(solicitud.dias_pendientes || 0) -
      Number(solicitud.dias_solicitados || 0);

    const fechasArray = obtenerFechasArray(solicitud.fechas_vacaciones);

    const fechasFormateadas =
      fechasArray.length > 0
        ? fechasArray.map((fecha) => formatearFechaLarga(fecha)).join(', ')
        : 'DIAS EN DIA DE LA SEMANA/DIA EN NUMERO/MES/AÑO';

    const fechaPresentacion = obtenerFechaPresentacion(
      solicitud.fechas_vacaciones
    );

    const jefeAutoriza = solicitud.jefe_autoriza || 'JEFE QUE AUTORIZA';

    const puestoJefeAutoriza =
      solicitud.puesto_jefe_autoriza || 'PUESTO';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(`NAVA, COAHUILA A; ${fechaElaboracion}`, 108, 56, {
      align: 'center',
    });

    doc.text('ASUNTO: SOLICITUD DE VACACIONES', 108, 62, {
      align: 'center',
    });

    doc.setTextColor(210, 0, 0);
    doc.setFontSize(10);

    doc.text(
      'TSU YASMIN HUERTA ENRIQUEZ RH O ING. IVAN OCHOA RODRIGUEZ',
      25,
      82
    );

    doc.text(
      'DIRECTORA DE RECURSOS HUMANOS O PRESIDENTE MUNICIPAL',
      25,
      88
    );

    doc.setTextColor(0, 0, 0);
    doc.text('P R E S E N T E.-', 25, 95);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.2);

    const textoPrincipal =
      `Por medio del presente, me dirijo a usted con el fin de dar a conocer que ` +
      `C. ${nombreEmpleado}, con el NUMERO DE EMPLEADO ${numeroEmpleado} solicita ` +
      `la autorización de ${diasSolicitados} día(s) de vacaciones, los cuales de ser autorizados ` +
      `serían del día ${fechasFormateadas} para presentarme a laborar el ${fechaPresentacion}.`;

    const lineasPrincipal = doc.splitTextToSize(textoPrincipal, 165);
    doc.text(lineasPrincipal, 25, 113);

    let y = 113 + lineasPrincipal.length * 5 + 5;

    if (y > 145) {
      y = 145;
    }

    doc.text(`Quedando pendientes ${diasRestantes} día(s).`, 25, y);

    y += 10;

    const textoFinal =
      'Esperando contar con su respuesta positiva a mi solicitud, quedo a sus órdenes para cualquier aclaración.';

    const lineasFinal = doc.splitTextToSize(textoFinal, 165);
    doc.text(lineasFinal, 25, y);

    const yAtentamente = 174;
    const yEmpleado = 202;
    const yAutoriza = 216;
    const yJefe = 228;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text('A T E N T A M E N T E', 62, yAtentamente, {
      align: 'center',
    });

    doc.setTextColor(210, 0, 0);

    const nombreEmpleadoLineas = doc.splitTextToSize(
      nombreEmpleado.toUpperCase(),
      70
    );

    doc.text(nombreEmpleadoLineas, 62, yEmpleado, {
      align: 'center',
    });

    doc.text(puestoEmpleado.toUpperCase(), 62, yEmpleado + 10, {
      align: 'center',
    });

    doc.setTextColor(0, 0, 0);

    doc.text('A U T O R I Z A', 155, yAutoriza, {
      align: 'center',
    });

    doc.setTextColor(210, 0, 0);

    const jefeLineas = doc.splitTextToSize(jefeAutoriza.toUpperCase(), 72);

    doc.text(jefeLineas, 155, yJefe, {
      align: 'center',
    });

    const puestoJefeY = yJefe + jefeLineas.length * 5 + 2;

    doc.text(puestoJefeAutoriza.toUpperCase(), 155, puestoJefeY, {
      align: 'center',
    });

    dibujarPiePagina(doc);
  };

  const generarPDFSolicitud = async (solicitud: Solicitud) => {
    try {
      const doc = new jsPDF('p', 'mm', 'letter');

      const escudoNava = await cargarImagenBase64('/img/escudo-nava.png');
      const logoNava = await cargarImagenBase64('/img/logo-nava.png');

      dibujarContenidoSolicitud(doc, solicitud, escudoNava, logoNava);

      const numeroEmpleado =
        solicitud.numero_empleado_solicitante || 'empleado';

      doc.save(`Solicitud_Vacaciones_${numeroEmpleado}_${solicitud.id}.pdf`);
    } catch (error) {
      console.log(error);
      alert('Error al generar PDF. Revisa que existan las imágenes en public/img.');
    }
  };

  const handleDescargarPDF = async (solicitud: Solicitud) => {
    await generarPDFSolicitud(solicitud);
  };

  const handleToggleSeleccion = (solicitudId: number) => {
    setSelectedSolicitudes((prev) =>
      prev.includes(solicitudId)
        ? prev.filter((id) => id !== solicitudId)
        : [...prev, solicitudId]
    );
  };

  const handleExportarPDF = async () => {
    if (selectedSolicitudes.length === 0) {
      alert('Selecciona al menos una solicitud para exportar a PDF.');
      return;
    }

    try {
      const solicitudesSeleccionadas = solicitudes.filter((solicitud) =>
        selectedSolicitudes.includes(solicitud.id)
      );

      const doc = new jsPDF('p', 'mm', 'letter');

      const escudoNava = await cargarImagenBase64('/img/escudo-nava.png');
      const logoNava = await cargarImagenBase64('/img/logo-nava.png');

      solicitudesSeleccionadas.forEach((solicitud, index) => {
        if (index > 0) {
          doc.addPage();
        }

        dibujarContenidoSolicitud(doc, solicitud, escudoNava, logoNava);
      });

      doc.save('Solicitudes_Vacaciones_RH.pdf');
    } catch (error) {
      console.log(error);
      alert('Error al exportar PDFs. Revisa que existan las imágenes en public/img.');
    }
  };

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const textoBusqueda = busqueda.toLowerCase();

    const coincideBusqueda =
      solicitud.nombre_completo_solicitante
        ?.toLowerCase()
        .includes(textoBusqueda) ||
      solicitud.numero_empleado_solicitante
        ?.toLowerCase()
        .includes(textoBusqueda) ||
      solicitud.nombre_departamento
        ?.toLowerCase()
        .includes(textoBusqueda) ||
      solicitud.jefe_autoriza
        ?.toLowerCase()
        .includes(textoBusqueda);

    const coincideDepartamento =
      filtroDepartamento === 'todos' ||
      solicitud.nombre_departamento === filtroDepartamento;

    return coincideBusqueda && coincideDepartamento;
  });

  const totalDias = solicitudes.reduce(
    (sum, s) => sum + Number(s.dias_solicitados || 0),
    0
  );

  const departamentosConSolicitudes = new Set(
    solicitudes.map((s) => s.nombre_departamento)
  ).size;

  const totalRestantes = solicitudes.reduce(
    (sum, s) =>
      sum +
      (Number(s.dias_pendientes || 0) - Number(s.dias_solicitados || 0)),
    0
  );

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
                  Portal de Recursos Humanos
                </h1>
                <p className="text-sm text-gray-600">
                  Solicitudes aceptadas por jefes
                </p>
                <p className="text-xs text-gray-500">
                  {usuario?.nombre || 'Recursos Humanos'}
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
                <FileCheck className="w-4 h-4" />
                Control de solicitudes autorizadas
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Consulta y descarga solicitudes aprobadas por jefes
              </h2>

              <p className="text-white/90 text-base sm:text-lg max-w-xl">
                Recursos Humanos puede visualizar todas las solicitudes aceptadas
                por los jefes de departamento y generar el formato PDF oficial.
              </p>
            </div>

            <div className="bg-white/12 border border-white/20 rounded-3xl p-6 backdrop-blur">
              <h3 className="font-bold text-lg mb-4">
                Resumen general
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Solicitudes</p>
                  <p className="text-3xl font-extrabold">{solicitudes.length}</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Días solicitados</p>
                  <p className="text-3xl font-extrabold">{totalDias}</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Departamentos</p>
                  <p className="text-3xl font-extrabold">{departamentosConSolicitudes}</p>
                </div>

                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-white/80">Seleccionadas</p>
                  <p className="text-3xl font-extrabold">{selectedSolicitudes.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-2xl">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">Aceptadas</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {solicitudes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">Días Totales</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {totalDias}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">Días Restantes</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {totalRestantes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm text-gray-600">Departamentos</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {departamentosConSolicitudes}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Solicitudes aceptadas por jefes
                </h2>
                <p className="text-sm text-gray-500">
                  Filtra, revisa y descarga el formato oficial de vacaciones.
                </p>
              </div>

              <button
                onClick={handleExportarPDF}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold shadow-md"
              >
                <Download className="w-5 h-5" />
                Exportar seleccionadas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre, número, jefe o departamento..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filtroDepartamento}
                  onChange={(e) => setFiltroDepartamento(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none bg-white"
                >
                  {departamentos.map((departamento) => (
                    <option key={departamento} value={departamento}>
                      {departamento === 'todos'
                        ? 'Todos los departamentos'
                        : departamento}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              {selectedSolicitudes.length > 0
                ? `${selectedSolicitudes.length} solicitud(es) seleccionada(s)`
                : 'Selecciona solicitudes para exportarlas en un solo PDF.'}
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
                  No se encontraron solicitudes
                </p>
                <p className="text-sm text-gray-500">
                  Intenta cambiar el filtro o la búsqueda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[1050px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Seleccionar
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Empleado
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Departamento
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Jefe autoriza
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Fechas
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Días
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        Restantes
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                        PDF
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 bg-white">
                    {solicitudesFiltradas.map((solicitud) => (
                      <tr key={solicitud.id} className="hover:bg-teal-50/40 transition-colors">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedSolicitudes.includes(solicitud.id)}
                            onChange={() => handleToggleSeleccion(solicitud.id)}
                            className="h-4 w-4 text-teal-700 border-gray-300 rounded"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                              <User className="w-5 h-5 text-teal-700" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {solicitud.nombre_completo_solicitante || 'Sin nombre'}
                              </p>
                              <p className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Hash className="w-3 h-3" />
                                {solicitud.numero_empleado_solicitante || 'Sin número'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold">
                            <Building2 className="w-3 h-3" />
                            {solicitud.nombre_departamento ||
                              `Departamento #${solicitud.departamento_id}`}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {solicitud.jefe_autoriza || 'Sin jefe registrado'}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600 max-w-[230px]">
                          {solicitud.fechas_vacaciones}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-bold">
                            {solicitud.dias_solicitados} día(s)
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
                            {Number(solicitud.dias_pendientes || 0) -
                              Number(solicitud.dias_solicitados || 0)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleDescargarPDF(solicitud)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors text-sm font-semibold"
                            title="Descargar PDF"
                          >
                            <Download className="w-4 h-4" />
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}