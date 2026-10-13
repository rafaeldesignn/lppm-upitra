import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  // Helper untuk mengecek halaman aktif
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#0b1329] text-white px-8 py-4 flex items-center justify-between border-b border-gray-800">
      {/* Brand / Logo (Kiri) */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
          L
        </div>
        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-wide">LPPM UPITRA</h1>
          <p className="text-xs text-gray-400 font-normal">Sistem Informasi Penelitian & Pengabdian Masyarakat</p>
        </div>
      </Link>

      {/* Menu Navigasi (Kanan) */}
      <div className="flex items-center gap-3">
        {/* Beranda */}
        <Link
          to="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isActive('/')
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          Beranda
        </Link>

        {/* Notice & News */}
        <Link
          to="/news"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive('/news')
              ? 'text-white bg-gray-800'
              : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          Notice & News
        </Link>

        {/* Events / Agenda */}
        <Link
          to="/events"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive('/events')
              ? 'text-white bg-gray-800'
              : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          Events / Agenda
        </Link>

        {/* Lecturer */}
        <Link
          to="/lecturers"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive('/lecturers')
              ? 'text-white bg-gray-800'
              : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          Lecturer
        </Link>

        {/* Tombol Login */}
        <Link
          to="/login"
          className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};