import React, { useState } from 'react';
import { registerUser, loginUser } from '../../services/storageService';
import { useUser } from '../../contexts/UserContext';

const AuthScreen = () => {
  const { setUser } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      const user = registerUser(username, password);
      if (user) {
        setUser(user);
      } else {
        setError("El usuario ya existe.");
      }
    } else {
      const user = loginUser(username, password);
      if (user) {
        setUser(user);
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900 transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-96 text-center border-4 border-blue-100 dark:border-blue-900">
        <div className="mb-6 flex justify-center">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Cinnamoroll" className="w-24 h-24 rounded-full bg-blue-100 p-2" alt="Logo" />
        </div>
        <h1 className="text-3xl font-bold text-blue-500 mb-2">TypoKawaii</h1>
        <p className="text-gray-400 mb-6">{isRegister ? 'Crea tu cuenta mágica' : 'Bienvenido de nuevo'}</p>

        {error && <div className="bg-red-100 text-red-500 p-2 rounded-lg mb-4 text-sm font-bold">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-3 rounded-lg border-2 border-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-400 outline-none transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-lg border-2 border-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-400 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-blue-400 text-white p-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-md hover:shadow-lg transform hover:-translate-y-1">
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          className="mt-4 text-blue-400 text-sm hover:underline"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
