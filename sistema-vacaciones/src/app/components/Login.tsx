import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'empleado' | 'jefe' | 'rh', userData: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const usuarios: Record<string, { password: string; rol: 'empleado' | 'jefe' | 'rh'; nombre: string; departamento: string; diasDisponibles?: number }> = {
      '1001': { password: '1001', rol: 'empleado', nombre: 'Juan Pérez', departamento: 'Ventas', diasDisponibles: 12 },
      '1002': { password: '1002', rol: 'empleado', nombre: 'Ana Martínez', departamento: 'Ventas', diasDisponibles: 10 },
      '1003': { password: '1003', rol: 'empleado', nombre: 'Luis Torres', departamento: 'Marketing', diasDisponibles: 8 },
      '1004': { password: '1004', rol: 'empleado', nombre: 'Carmen López', departamento: 'Administración', diasDisponibles: 15 },
      '2001': { password: '2001', rol: 'jefe', nombre: 'María González', departamento: 'Ventas' },
      '2002': { password: '2002', rol: 'jefe', nombre: 'Roberto Sánchez', departamento: 'Administración' },
      '3001': { password: '3001', rol: 'rh', nombre: 'Andy', departamento: 'Recursos Humanos' },
    };

    const usuario = usuarios[userId];

    if (!usuario) {
      alert('ID de usuario no encontrado');
      return;
    }

    if (usuario.password !== password) {
      alert('Contraseña incorrecta');
      setPassword('');
      return;
    }

    onLogin(usuario.rol, {
      id: userId,
      nombre: usuario.nombre,
      departamento: usuario.departamento,
      diasDisponibles: usuario.diasDisponibles,
      rol: usuario.rol,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Sistema de Vacaciones</h1>
          <p className="text-gray-600 mt-2">Control de solicitudes y autorizaciones</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de Usuario
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ingresa tu ID"
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

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Usuarios de prueba:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p><strong>Empleados:</strong> 1001, 1002, 1003, 1004</p>
            <p><strong>Jefes:</strong> 2001, 2002</p>
            <p><strong>RH:</strong> 3001 (Andy)</p>
            <p className="text-yellow-700 mt-2">* La contraseña es igual al ID</p>
          </div>
        </div>
      </div>
    </div>
  );
}