import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  Microscope, 
  Handshake, 
  UserCheck, 
  Home, 
  Send, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Download, 
  Loader2,
  AlertCircle,
  MapPin,
  Search,
  Mail,
  ArrowLeft,
  FileText,
  Users,
  LogOut,
  Target,
  Compass
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

interface NewsItem {
  id?: number;
  judul?: string;
  isi?: string;
  tanggal?: string;
}

interface GuideItem {
  id?: number;
  nama_dokumen?: string;
  kategori?: string;
  url_download?: string;
}

interface EventItem {
  id?: number;
  judul?: string;
  lokasi?: string;
  tanggal_event?: string;
  keterangan?: string;
}

interface PenelitianItem {
  id?: number;
  judul?: string;
  ketua?: string;
  abstrak?: string;
  bidang?: string;
  tahun?: number | string;
  status?: string;
  alasan?: string;
}

interface PengabdianItem {
  id?: number;
  judul?: string;
  ketua?: string;
  lokasi?: string;
  tahun?: number | string;
}

interface DosenItem {
  id?: number;
  nama?: string;
  jabatan?: string;
  bidang_kepakaran?: string;
  email?: string;
  foto_url?: string;
  tentang?: string;
  pendidikan?: string;
  publikasi?: string;
  penelitian?: string;
  pengabdian?: string;
}

interface FormState {
  title: string;
  name: string;
  email: string;
  scheme: string;
  description: string;
}

type TabType = 'home' | 'news' | 'agenda' | 'guides' | 'riset' | 'pkm' | 'dosen' | 'login';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return (savedTab as TabType) || 'home';
  });

  // State Autentikasi Frontend
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [guideList, setGuideList] = useState<GuideItem[]>([]);
  const [agendaList, setAgendaList] = useState<EventItem[]>([]);
  const [risetList, setRisetList] = useState<PenelitianItem[]>([]);
  const [pkmList, setPkmList] = useState<PengabdianItem[]>([]);
  const [dosenList, setDosenList] = useState<DosenItem[]>([]);

  // State Pencarian Dosen & Detail Dosen
  const [searchDosen, setSearchDosen] = useState<string>('');
  const [selectedDosen, setSelectedDosen] = useState<DosenItem | null>(null);
  const [dosenSubTab, setDosenSubTab] = useState<'tentang' | 'publikasi' | 'penelitian' | 'pengabdian'>('tentang');

  const [formData, setFormData] = useState<FormState>({
    title: '',
    name: '',
    email: '',
    scheme: 'Penelitian Dasar Internal',
    description: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      const [resNews, resAgenda, resGuides, resRiset, resPkm, resDosen] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/news`),
        fetch(`${API_BASE_URL}/events`),
        fetch(`${API_BASE_URL}/guides`),
        fetch(`${API_BASE_URL}/penelitian`),
        fetch(`${API_BASE_URL}/pengabdian`),
        fetch(`${API_BASE_URL}/dosen`)
      ]);

      if (resNews.status === 'fulfilled' && resNews.value.ok) {
        const data = await resNews.value.json();
        setNewsList(Array.isArray(data) ? data : []);
      }
      if (resAgenda.status === 'fulfilled' && resAgenda.value.ok) {
        const data = await resAgenda.value.json();
        setAgendaList(Array.isArray(data) ? data : []);
      }
      if (resGuides.status === 'fulfilled' && resGuides.value.ok) {
        const data = await resGuides.value.json();
        setGuideList(Array.isArray(data) ? data : []);
      }
      if (resRiset.status === 'fulfilled' && resRiset.value.ok) {
        const data = await resRiset.value.json();
        setRisetList(Array.isArray(data) ? data : []);
      }
      if (resPkm.status === 'fulfilled' && resPkm.value.ok) {
        const data = await resPkm.value.json();
        setPkmList(Array.isArray(data) ? data : []);
      }
      if (resDosen.status === 'fulfilled' && resDosen.value.ok) {
        const data = await resDosen.value.json();
        setDosenList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Gagal mengambil data backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function initData() {
      await fetchAllData();
      if (!isMounted) return;
    }
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler Login & Logout
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setActiveTab('riset');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    setActiveTab('home');
  };

  const handleRisetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        judul: formData.title,
        ketua: formData.name,
        abstrak: formData.description,
        bidang: 'Internal UPITRA',
        tahun: 2026,
        status: 'Review',
        alasan: ''
      };

      const res = await fetch(`${API_BASE_URL}/penelitian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ title: '', name: '', email: '', scheme: 'Penelitian Dasar Internal', description: '' });
        await fetchAllData();
      } else {
        setErrorMsg('Gagal mengirimkan data proposal riset');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server backend');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePkmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        judul: formData.title,
        ketua: formData.name,
        lokasi: formData.description || 'Kampus UPITRA',
        tahun: 2026
      };

      const res = await fetch(`${API_BASE_URL}/pengabdian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ title: '', name: '', email: '', scheme: 'Penelitian Dasar Internal', description: '' });
        await fetchAllData();
      } else {
        setErrorMsg('Gagal mengirimkan usulan PkM');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server backend');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDosen = dosenList.filter((d) =>
    (d.nama || '').toLowerCase().includes(searchDosen.toLowerCase()) ||
    (d.bidang_kepakaran || '').toLowerCase().includes(searchDosen.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* HEADER NAVBAR */}
      <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-md border-b border-slate-800/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          <div 
            onClick={() => {
              setActiveTab('home');
              setSelectedDosen(null);
              setSubmitSuccess(false);
            }}
            className="cursor-pointer select-none shrink-0 flex items-center gap-3 group"
          >
            <img 
              src="http://localhost:5000/logo.png" 
              alt="Logo UPITRA" 
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <h1 className="font-extrabold text-blue-400 text-xl tracking-wide leading-none group-hover:text-blue-300 transition-colors">
                LPPM UPITRA
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-1 whitespace-nowrap">
                Sistem Informasi Penelitian & Pengabdian Masyarakat
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center justify-end gap-1 flex-1">
            {/* Menu Navigasi Publik */}
            {[
              { id: 'home', label: 'Beranda', icon: Home },
              { id: 'news', label: 'Berita', icon: Megaphone },
              { id: 'agenda', label: 'Agenda', icon: Calendar },
              { id: 'dosen', label: 'Dosen', icon: UserCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSelectedDosen(null);
                    setSubmitSuccess(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}

            {/* Menu Privat (Hanya Muncul Jika SUDAH Login) */}
            {isLoggedIn && (
              <>
                {[
                  { id: 'guides', label: 'Dokumen', icon: FileText },
                  { id: 'riset', label: 'Riset', icon: Microscope },
                  { id: 'pkm', label: 'Pengabdian (PkM)', icon: Handshake },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as TabType);
                        setSelectedDosen(null);
                        setSubmitSuccess(false);
                      }}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 scale-[1.02]'
                          : 'text-emerald-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon size={14} className="shrink-0" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </>
            )}

            {/* Tombol Login / Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-600/20 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all duration-200 shrink-0 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('login');
                  setSelectedDosen(null);
                  setSubmitSuccess(false);
                }}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ml-2 ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]'
                    : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <span>Login</span>
              </button>
            )}
          </nav>

        </div>
      </header>

      {/* HERO SECTION */}
      {activeTab === 'home' && (
        <section className="bg-slate-900 text-white py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-5 relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800/50 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              PORTAL INTEGRASI LPPM UNIVERSITAS UPITRA
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pusat Pelayanan Riset & Pengabdian Masyarakat
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Layanan terpadu untuk pengajuan proposal riset, pengabdian masyarakat (PkM), profil dosen, agenda, dan unduhan dokumen resmi LPPM.
            </p>
          </div>
        </section>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-sm font-medium">Sinkronisasi data dengan server LPPM...</p>
          </div>
        ) : (
          <div>
            {/* BERANDA */}
            {activeTab === 'home' && (
              <div className="space-y-12">
                {/* 1. RINGKASAN STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Microscope size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{risetList.length}</div>
                      <div className="text-xs text-slate-500 font-medium">Proposal Riset</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Handshake size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{pkmList.length}</div>
                      <div className="text-xs text-slate-500 font-medium">Kegiatan PkM</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{dosenList.length}</div>
                      <div className="text-xs text-slate-500 font-medium">Dosen & Peneliti</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{guideList.length}</div>
                      <div className="text-xs text-slate-500 font-medium">Dokumen Panduan</div>
                    </div>
                  </div>
                </div>

                {/* 2. VISI & MISI */}
                <div className="grid md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <Target size={20} />
                      </div>
                      <h3>Visi LPPM UPITRA</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Menjadi lembaga riset dan pengabdian masyarakat yang unggul, inovatif, serta berdampak nyata bagi ilmu pengetahuan dan kesejahteraan masyarakat berlandaskan nilai-nilai integritas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                      <div className="p-2 bg-emerald-50 rounded-xl">
                        <Compass size={20} />
                      </div>
                      <h3>Misi Utama</h3>
                    </div>
                    <ul className="text-slate-600 text-sm space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>Mengembangkan penelitian terapan berstandar mutu tinggi.</li>
                      <li>Mendorong kegiatan PkM yang solutif bagi kelompok mitra.</li>
                      <li>Memperkuat tata kelola publikasi serta HKI civitas akademika.</li>
                    </ul>
                  </div>
                </div>

                {/* 3. BERITA TERBARU */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Berita Terbaru</h2>
                      <p className="text-sm text-slate-500">Pengumuman dan kabar terbaru seputar LPPM UPITRA</p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('news');
                        setSubmitSuccess(false);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 cursor-pointer group"
                    >
                      Lihat Semua <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {newsList.length === 0 ? (
                      <p className="text-slate-400 text-sm col-span-3">Belum ada berita terbaru.</p>
                    ) : (
                      newsList.slice(0, 3).map((item, index) => (
                        <div key={item.id || index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                              PENGUMUMAN
                            </span>
                            <h3 className="font-bold text-slate-900 mt-3 text-lg leading-snug line-clamp-2">
                              {item.judul || 'Tanpa Judul'}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                              <Clock size={14} /> {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : 'Terbaru'}
                            </p>
                            <p className="text-slate-600 text-sm mt-3 line-clamp-3 leading-relaxed">
                              {item.isi || 'Tidak ada deskripsi.'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. AGENDA AKADEMIK */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Agenda Akademik</h2>
                      <p className="text-sm text-slate-500">Jadwal kegiatan penting, seminar, dan tenggat waktu proposal</p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('agenda');
                        setSubmitSuccess(false);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 cursor-pointer group"
                    >
                      Lihat Semua Agenda <ChevronRight size={16} />
                    </button>
                  </div>

                  {agendaList.length === 0 ? (
                    <p className="text-slate-400 text-sm">Belum ada agenda terdekat.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {agendaList.slice(0, 2).map((event, index) => (
                        <div key={event.id || index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
                              AGENDA MENDATANG
                            </span>
                            <h3 className="font-bold text-slate-900 text-base leading-snug">
                              {event.judul || 'Tanpa Judul Event'}
                            </h3>
                            {event.lokasi && (
                              <p className="text-xs text-slate-500 flex items-center gap-1 pt-0.5">
                                <MapPin size={12} className="text-slate-400" /> {event.lokasi}
                              </p>
                            )}
                          </div>
                          <div className="text-blue-600 font-bold text-xs bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 shrink-0">
                            <Calendar size={14} />
                            {event.tanggal_event ? new Date(event.tanggal_event).toLocaleDateString('id-ID') : 'Akan Datang'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* MODUL 1: BERITA */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="text-blue-600" /> Berita LPPM
                </h2>
                {newsList.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    Belum ada data berita di server backend.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {newsList.map((item, index) => (
                      <div key={item.id || index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                          PENGUMUMAN
                        </span>
                        <h3 className="font-bold text-slate-900 mt-2 text-lg">{item.judul || 'Tanpa Judul'}</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Clock size={14} /> {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : 'Terbaru'}
                        </p>
                        <p className="text-slate-600 text-sm mt-3">{item.isi || 'Tidak ada isi berita.'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MODUL 2: AGENDA */}
            {activeTab === 'agenda' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="text-blue-600" /> Agenda Akademik
                </h2>
                {agendaList.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    Belum ada agenda kegiatan yang terdaftar di database server.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agendaList.map((event, index) => (
                      <div key={event.id || index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                            EVENT AKADEMIK
                          </span>
                          <h3 className="font-bold text-slate-900 text-lg leading-snug">
                            {event.judul || 'Tanpa Judul Event'}
                          </h3>
                          {event.lokasi && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" /> {event.lokasi}
                            </p>
                          )}
                          <p className="text-slate-600 text-sm pt-2">{event.keterangan || 'Tidak ada keterangan tambahan.'}</p>
                        </div>
                        <div className="text-blue-600 font-semibold text-sm bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2">
                          <Calendar size={16} /> {event.tanggal_event ? new Date(event.tanggal_event).toLocaleDateString('id-ID') : 'Akan Datang'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MODUL 3: HALAMAN LOGIN */}
            {activeTab === 'login' && (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg my-10">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Login Sistem LPPM</h2>
                  <p className="text-sm text-slate-500 mt-1">Masuk untuk mengakses Dokumen, Riset, dan PkM</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email / NIDN</label>
                    <input 
                      type="text" 
                      required
                      placeholder="dosen@upitra.ac.id" 
                      className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    Masuk Sekarang
                  </button>
                </form>
              </div>
            )}

            {/* MODUL 4: DOKUMEN (AREA PRIVAT) */}
            {activeTab === 'guides' && isLoggedIn && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-emerald-600" /> Dokumen & Template
                </h2>
                {guideList.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    Belum ada file dokumen di server backend.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {guideList.map((item, index) => (
                      <div key={item.id || index} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                            {item.kategori || 'Dokumen'}
                          </span>
                          <h3 className="font-bold text-slate-900 mt-2 text-base">{item.nama_dokumen || 'Dokumen Tanpa Nama'}</h3>
                        </div>
                        <a 
                          href={item.url_download || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200 text-xs font-bold flex items-center gap-1.5 shrink-0"
                        >
                          <Download size={16} /> Unduh File
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MODUL 5: PROPOSAL SUBMISSION - RISET (AREA PRIVAT) */}
            {activeTab === 'riset' && isLoggedIn && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Microscope className="text-blue-600" /> Proposal Submission (Riset)
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Formulir pengajuan usulan proposal penelitian/riset LPPM.
                    </p>
                  </div>

                  {submitSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-3">
                      <CheckCircle className="mx-auto text-emerald-600" size={52} />
                      <h3 className="font-bold text-xl">Proposal Riset Berhasil Terkirim!</h3>
                      <p className="text-sm text-emerald-700">Data penelitian telah dicatat di backend LPPM.</p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition cursor-pointer"
                      >
                        Kirim Proposal Riset Lain
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRisetSubmit} className="space-y-5">
                      {errorMsg && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-lg text-sm flex items-center gap-2">
                          <AlertCircle size={18} />
                          {errorMsg}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Research / Riset</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          placeholder="Judul penelitian..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Dosen / Peneliti</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          placeholder="Nama dan gelar..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ringkasan / Abstrak Riset</label>
                        <textarea 
                          rows={4}
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          placeholder="Abstrak usulan riset..."
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 flex justify-center items-center gap-2 cursor-pointer"
                      >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Kirim Proposal Riset
                      </button>
                    </form>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Daftar Proposal Riset ({risetList.length})</h3>
                  {risetList.length === 0 ? (
                    <p className="text-slate-400 text-sm">Belum ada proposal riset yang terdaftar.</p>
                  ) : (
                    risetList.map((item, index) => (
                      <div key={item.id || index} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            item.status === 'Berjalan' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            item.status === 'Selesai' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                            item.status === 'Ditolak' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                            'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            {item.status === 'Selesai' ? '🎉 Selesai' :
                             item.status === 'Disetujui' ? '✅ Disetujui' :
                             item.status === 'Berjalan' ? '🚀 Berjalan' :
                             item.status === 'Ditolak' ? '❌ Ditolak' :
                             '⏳ Review'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{item.tahun || '2026'}</span>
                        </div>

                        <h4 className="font-semibold text-slate-900 text-sm">{item.judul || 'Tanpa Judul'}</h4>
                        <p className="text-xs text-slate-500">Ketua: {item.ketua || '-'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* MODUL 6: PENGABDIAN - PKM (AREA PRIVAT) */}
            {activeTab === 'pkm' && isLoggedIn && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Handshake className="text-emerald-600" /> Pengabdian (PkM)
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Formulir usulan kegiatan Pengabdian kepada Masyarakat.
                    </p>
                  </div>

                  {submitSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-3">
                      <CheckCircle className="mx-auto text-emerald-600" size={52} />
                      <h3 className="font-bold text-xl">Usulan PkM Berhasil Dikirim!</h3>
                      <p className="text-sm text-emerald-700">Kegiatan pengabdian masyarakat telah dicatat.</p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition cursor-pointer"
                      >
                        Kirim Usulan PkM Lain
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePkmSubmit} className="space-y-5">
                      {errorMsg && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-lg text-sm flex items-center gap-2">
                          <AlertCircle size={18} />
                          {errorMsg}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Kegiatan PkM</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                          placeholder="Judul pengabdian..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Ketua Pelaksana</label>
                        <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                          placeholder="Nama dan gelar..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lokasi Pelaksanaan PkM</label>
                        <input 
                          type="text" 
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                          placeholder="Desa / Mitra / Instansi..."
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex justify-center items-center gap-2 cursor-pointer"
                      >
                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Kirim Usulan PkM
                      </button>
                    </form>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Daftar PkM ({pkmList.length})</h3>
                  {pkmList.length === 0 ? (
                    <p className="text-slate-400 text-sm">Belum ada kegiatan PkM terdaftar.</p>
                  ) : (
                    pkmList.map((item, index) => (
                      <div key={item.id || index} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">PkM Aktif</span>
                          <span className="text-xs text-slate-400 font-medium">{item.tahun || '2026'}</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm">{item.judul || 'Tanpa Judul'}</h4>
                        <p className="text-xs text-slate-500">Ketua: {item.ketua || '-'}</p>
                        {item.lokasi && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {item.lokasi}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* MODUL 7: DOSEN & PENELITI */}
            {activeTab === 'dosen' && (
              <div className="space-y-6">
                {selectedDosen ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-6">
                    <button 
                      onClick={() => setSelectedDosen(null)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      <ArrowLeft size={16} /> Kembali ke Daftar Dosen
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-100 pb-6">
                      <div className="w-28 h-28 rounded-2xl bg-blue-100 text-blue-600 font-bold text-3xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {selectedDosen.foto_url ? (
                          <img src={selectedDosen.foto_url} alt={selectedDosen.nama} className="w-full h-full object-cover" />
                        ) : (
                          (selectedDosen.nama || 'D').charAt(0)
                        )}
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900">{selectedDosen.nama}</h2>
                        <p className="text-sm font-semibold text-blue-600">{selectedDosen.jabatan || 'Dosen Peneliti'}</p>
                        <p className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block font-medium">
                          Kepakaran: {selectedDosen.bidang_kepakaran || 'Umum'}
                        </p>
                        {selectedDosen.email && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                            <Mail size={14} className="text-slate-400" /> {selectedDosen.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
                      {[
                        { id: 'tentang', label: 'Tentang' },
                        { id: 'publikasi', label: 'Publikasi' },
                        { id: 'penelitian', label: 'Penelitian' },
                        { id: 'pengabdian', label: 'Pengabdian' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setDosenSubTab(tab.id as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                            dosenSubTab === tab.id
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="text-slate-700 text-sm leading-relaxed pt-2">
                      {dosenSubTab === 'tentang' && (
                        <p>{selectedDosen.tentang || 'Belum ada informasi biografi singkat untuk dosen ini.'}</p>
                      )}
                      {dosenSubTab === 'publikasi' && (
                        <p className="whitespace-pre-line">{selectedDosen.publikasi || 'Belum ada data publikasi tercatat.'}</p>
                      )}
                      {dosenSubTab === 'penelitian' && (
                        <p className="whitespace-pre-line">{selectedDosen.penelitian || 'Belum ada riwayat penelitian tercatat.'}</p>
                      )}
                      {dosenSubTab === 'pengabdian' && (
                        <p className="whitespace-pre-line">{selectedDosen.pengabdian || 'Belum ada riwayat pengabdian tercatat.'}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                          <UserCheck className="text-blue-600" /> Direktori Dosen & Peneliti
                        </h2>
                        <p className="text-sm text-slate-500">Daftar dosen pengampu riset dan pengabdian LPPM UPITRA</p>
                      </div>

                      <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={searchDosen}
                          onChange={(e) => setSearchDosen(e.target.value)}
                          placeholder="Cari nama atau kepakaran..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>

                    {filteredDosen.length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                        Tidak ditemukan dosen yang sesuai dengan kata kunci pencarian.
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 gap-6">
                        {filteredDosen.map((dosen, index) => (
                          <div 
                            key={dosen.id || index}
                            onClick={() => {
                              setSelectedDosen(dosen);
                              setDosenSubTab('tentang');
                            }}
                            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                                {dosen.foto_url ? (
                                  <img src={dosen.foto_url} alt={dosen.nama} className="w-full h-full object-cover" />
                                ) : (
                                  (dosen.nama || 'D').charAt(0)
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 text-base leading-snug">{dosen.nama}</h3>
                                <p className="text-xs font-semibold text-blue-600 mt-0.5">{dosen.jabatan || 'Dosen Peneliti'}</p>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                              <span className="text-slate-500 truncate max-w-[180px]">Kepakaran: <strong className="text-slate-700">{dosen.bidang_kepakaran || 'Umum'}</strong></span>
                              <span className="text-blue-600 font-bold flex items-center gap-1">
                                Profil <ChevronRight size={14} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-200 text-sm">Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM)</p>
            <p className="mt-1">Universitas Pignatelli Triputra (UPITRA) © 2026. Hak Cipta Dilindungi.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-mono">Server Status: Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}