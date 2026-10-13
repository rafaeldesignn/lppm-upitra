import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation login (dummy token)
    login('dummy-jwt-token-12345', { name: 'Dosen UPITRA', role: 'lecturer' });
    navigate('/dashboard/riset');
  };

  return (
    <div className="min-h-screen bg-[#0b1329] flex items-center justify-center p-4">
      <div className="bg-[#131f3d] p-8 rounded-2xl border border-gray-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Login LPPM UPITRA</h2>
        <p className="text-sm text-gray-400 mb-6 text-center">Masukkan akun Dosen / Peneliti</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email / NIDN</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0b1329] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="dosen@upitra.ac.id"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0b1329] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition mt-2"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};