import { useState } from 'react';
import Login from './components/Login';
import EmpleadoDashboard from './components/EmpleadoDashboard';
import JefeDashboard from './components/JefeDashboard';
import RHDashboard from './components/RHDashboard';

type UserRole = 'empleado' | 'jefe' | 'rh' | null;

export default function App() {
  const [usuario, setUsuario] = useState<any>(null);
  const [rol, setRol] = useState<UserRole>(null);

  const handleLogin = (userRole: 'empleado' | 'jefe' | 'rh', userData: any) => {
    setRol(userRole);
    setUsuario(userData);
  };

  const handleLogout = () => {
    setRol(null);
    setUsuario(null);
  };

  if (!rol || !usuario) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="size-full">
      {rol === 'empleado' && <EmpleadoDashboard usuario={usuario} onLogout={handleLogout} />}
      {rol === 'jefe' && <JefeDashboard usuario={usuario} onLogout={handleLogout} />}
      {rol === 'rh' && <RHDashboard usuario={usuario} onLogout={handleLogout} />}
    </div>
  );
}