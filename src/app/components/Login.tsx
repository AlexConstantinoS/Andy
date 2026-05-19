import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (rol: string, usuario: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correo.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:3000/api/login', {
        correo,
        password,
      });

      const data = response.data;

      localStorage.setItem('token', data.token);
      onLogin(data.usuario.rol, data.usuario);
    } catch (err: any) {
      console.log(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Lado izquierdo */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-900 text-white p-10 relative">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <img
                src="/img/escudo-nava.png"
                alt="Escudo Nava"
                className="w-20 h-20 object-contain bg-white rounded-xl p-2 shadow-lg"
              />
              <img
                src="/img/logo-nava.png"
                alt="Logo Nava"
                className="w-28 h-20 object-contain bg-white rounded-xl p-2 shadow-lg"
              />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Sistema de
              <br />
              Solicitud de Vacaciones
            </h1>

            <p className="text-white/90 text-lg leading-relaxed mb-8">
              Gobierno Municipal de Nava, Coahuila de Zaragoza
            </p>

            <div className="space-y-3 text-sm text-white/90">
              <p>• Portal para empleados, jefes de departamento y RH</p>
              <p>• Gestión de solicitudes de vacaciones</p>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="p-8 sm:p-10 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Logos en móvil */}
            <div className="lg:hidden flex justify-center items-center gap-4 mb-6">
              <img
                src="/img/escudo-nava.png"
                alt="Escudo Nava"
                className="w-16 h-16 object-contain"
              />
              <img
                src="/img/logo-nava.png"
                alt="Logo Nava"
                className="w-24 h-16 object-contain"
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Accede al sistema con tu correo y contraseña
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="ejemplo@empresa.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
              <p>Gobierno Municipal de Nava, Coahuila</p>
              <p>Administración 2025 - 2027</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}