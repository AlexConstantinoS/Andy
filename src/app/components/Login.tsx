import { useState } from 'react';
import { LogIn } from 'lucide-react';
import axios from 'axios';

interface LoginProps {
  onLogin: (role: 'empleado' | 'jefe' | 'rh', userData: any) => void;
}

export default function Login({ onLogin }: LoginProps) {

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        'http://localhost:3000/api/login',
        {
          correo,
          password
        }
      );

      const data = response.data;

      console.log('LOGIN:', data);

      localStorage.setItem('token', data.token);

      localStorage.setItem(
        'usuario',
        JSON.stringify(data.usuario)
      );

      onLogin(
        data.usuario.rol,
        data.usuario
      );

    } catch (error) {

      console.log(error);

      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Sistema de Vacaciones
          </h1>

          <p className="text-gray-600 mt-2">
            Control de solicitudes y autorizaciones
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo
            </label>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="correo@empresa.com"
              required
              autoFocus
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />

          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Iniciar Sesión
          </button>

        </form>

      </div>

    </div>
  );
}