// Updated Hero component
import React from 'react';

export const Hero: React.FC = () => {
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
      </div>
    </section>
  );
};