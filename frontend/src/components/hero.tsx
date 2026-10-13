import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAction = (targetPath: string) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      // Jika belum login, ke login dulu
      navigate('/login');
    }
  };

  return (
    <section className="bg-[#0b1329] text-white py-20 px-6 text-center border-b border-gray-800">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold text-blue-400 bg-blue-900/40 border border-blue-500/30 rounded-full">
          PORTAL INTEGRASI LPPM UNIVERSITAS UPITRA
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Pusat Pelayanan Riset & Pengabdian Masyarakat
        </h1>

        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Layanan terpadu untuk pengajuan proposal riset, pengabdian masyarakat (PkM), profil dosen, agenda, dan unduhan dokumen resmi LPPM.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleAction('/dashboard/riset')}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-600/30"
          >
            🔬 Pengajuan Riset
          </button>
          <button
            onClick={() => handleAction('/dashboard/pkm')}
            className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-lg shadow-emerald-600/30"
          >
            🤝 Pengajuan PkM
          </button>
        </div>
      </div>
    </section>
  );
};