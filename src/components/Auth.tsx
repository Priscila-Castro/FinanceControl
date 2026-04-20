import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert('Conta criada! Verifique o email 📩');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm space-y-4">
        <h2 className="text-white text-xl text-center">
            {isLogin ? 'Entrar' : 'Criar conta'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <button
          onClick={isLogin ? handleLogin : handleSignup}
          className="w-full bg-blue-500 py-2 rounded"
        >
          {isLogin ? 'Entrar' : 'Criar conta'}
        </button>

        <p className="text-gray-400 text-sm text-center mt-2">
          {isLogin ? 'Primeira vez?' : 'Já tem conta?'}
        </p>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 text-sm w-full"
        >
          {isLogin ? 'Criar conta' : 'Fazer login'}
        </button>
      </div>
    </div>
  );
}