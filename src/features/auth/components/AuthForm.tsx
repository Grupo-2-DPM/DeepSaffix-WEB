import { useState } from 'react';

interface AuthFormProps {
  onLoginSuccess: () => void;
}

export const AuthForm = ({ onLoginSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación: No validamos, solo dejamos pasar
    onLoginSuccess();
  };

  return (
    <div className="flex-grow ax-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input type="text" placeholder="Nombre completo" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        )}
        <input type="email" placeholder="Correo electrónico" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
        <input type="password" placeholder="Contraseña" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
        
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'} {' '}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 font-bold hover:underline"
        >
        {isLogin ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  );
};