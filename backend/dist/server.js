"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// MELAYANI LOGO DARI FOLDER PUBLIC FRONTEND
app.use('/logo.png', express_1.default.static(path_1.default.join(__dirname, '../../frontend/public/logo.png')));
// Helper Sanitasi HTML
const escapeHtml = (str) => {
    if (!str)
        return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
// Helper Async Handler
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// ==========================================
// 1. ROUTER REST API (Prefix: /api)
// ==========================================
const apiRouter = express_1.default.Router();
// 📢 NEWS / PENGUMUMAN API
const getNews = asyncHandler(async (req, res) => {
    const [rows] = await db_1.db.query('SELECT * FROM pengumuman ORDER BY tanggal DESC');
    res.json(rows);
});
apiRouter.get('/news', getNews);
apiRouter.get('/pengumuman', getNews);
apiRouter.post('/news', asyncHandler(async (req, res) => {
    const { judul, isi, tanggal } = req.body;
    if (!judul || !isi)
        return res.status(400).json({ error: 'Judul dan Isi wajib diisi' });
    await db_1.db.query('INSERT INTO pengumuman (judul, isi, tanggal) VALUES (?, ?, ?)', [judul, isi, tanggal || new Date()]);
    res.status(201).json({ message: 'Sukses' });
}));
apiRouter.delete('/news/:id', asyncHandler(async (req, res) => {
    await db_1.db.query('DELETE FROM pengumuman WHERE id = ?', [req.params.id]);
    res.json({ message: 'Terhapus' });
}));
// 📁 GUIDES / DOKUMEN API
const getGuides = asyncHandler(async (req, res) => {
    const [rows] = await db_1.db.query('SELECT * FROM dokumen ORDER BY id DESC');
    res.json(rows);
});
apiRouter.get('/guides', getGuides);
apiRouter.get('/dokumen', getGuides);
apiRouter.post('/guides', asyncHandler(async (req, res) => {
    const { nama_dokumen, kategori, url_download } = req.body;
    await db_1.db.query('INSERT INTO dokumen (nama_dokumen, kategori, url_download) VALUES (?, ?, ?)', [nama_dokumen, kategori, url_download]);
    res.status(201).json({ message: 'Sukses' });
}));
apiRouter.delete('/guides/:id', asyncHandler(async (req, res) => {
    await db_1.db.query('DELETE FROM dokumen WHERE id = ?', [req.params.id]);
    res.json({ message: 'Terhapus' });
}));
// 📅 EVENTS API
apiRouter.get('/events', asyncHandler(async (req, res) => {
    const [rows] = await db_1.db.query('SELECT * FROM events ORDER BY tanggal_event ASC');
    res.json(rows);
}));
apiRouter.post('/events', asyncHandler(async (req, res) => {
    const { judul, lokasi, tanggal_event, keterangan } = req.body;
    await db_1.db.query('INSERT INTO events (judul, lokasi, tanggal_event, keterangan) VALUES (?, ?, ?, ?)', [judul, lokasi, tanggal_event, keterangan]);
    res.status(201).json({ message: 'Sukses' });
}));
apiRouter.delete('/events/:id', asyncHandler(async (req, res) => {
    await db_1.db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Terhapus' });
}));
// 🔬 PENELITIAN API
apiRouter.get('/penelitian', asyncHandler(async (req, res) => {
    const [rows] = await db_1.db.query('SELECT * FROM penelitian ORDER BY id DESC');
    res.json(rows);
}));
apiRouter.post('/penelitian', asyncHandler(async (req, res) => {
    const { judul, ketua, abstrak, bidang, tahun, status, alasan } = req.body;
    await db_1.db.query('INSERT INTO penelitian (judul, ketua, abstrak, bidang, tahun, status, alasan) VALUES (?, ?, ?, ?, ?, ?, ?)', [judul, ketua, abstrak || '', bidang || 'Internal UPITRA', tahun || 2026, status || 'Review', alasan || '']);
    res.status(201).json({ message: 'Sukses' });
}));
apiRouter.put('/penelitian/:id/status', asyncHandler(async (req, res) => {
    const { status, alasan } = req.body;
    await db_1.db.query('UPDATE penelitian SET status = ?, alasan = ? WHERE id = ?', [status, alasan || '', req.params.id]);
    res.json({ message: 'Status dan Alasan riset berhasil diperbarui' });
}));
apiRouter.delete('/penelitian/:id', asyncHandler(async (req, res) => {
    await db_1.db.query('DELETE FROM penelitian WHERE id = ?', [req.params.id]);
    res.json({ message: 'Terhapus' });
}));
// 🤝 PENGABDIAN (PKM) API
apiRouter.get('/pengabdian', asyncHandler(async (req, res) => {
    const [rows] = await db_1.db.query('SELECT * FROM pengabdian ORDER BY id DESC');
    res.json(rows);
}));
apiRouter.post('/pengabdian', asyncHandler(async (req, res) => {
    const { judul, ketua, lokasi, tahun, status, alasan } = req.body;
    await db_1.db.query('INSERT INTO pengabdian (judul, ketua, lokasi, tahun, status, alasan) VALUES (?, ?, ?, ?, ?, ?)', [judul, ketua, lokasi || '', tahun || 2026, status || 'Review', alasan || '']);
    res.status(201).json({ message: 'Sukses' });
}));
apiRouter.put('/pengabdian/:id/status', asyncHandler(async (req, res) => {
    const { status, alasan } = req.body;
    await db_1.db.query('UPDATE pengabdian SET status = ?, alasan = ? WHERE id = ?', [status || 'Review', alasan || '', req.params.id]);
    res.json({ message: 'Status dan Alasan PkM berhasil diperbarui' });
}));
apiRouter.delete('/pengabdian/:id', asyncHandler(async (req, res) => {
    await db_1.db.query('DELETE FROM pengabdian WHERE id = ?', [req.params.id]);
    res.json({ message: 'Terhapus' });
}));
// 👨‍🏫 SISTEM INFORMASI DOSEN API
apiRouter.get('/dosen', asyncHandler(async (req, res) => {
    const [rows] = await db_1.db.query('SELECT * FROM dosen ORDER BY id DESC');
    res.json(rows);
}));
apiRouter.post('/dosen', asyncHandler(async (req, res) => {
    const { nama, jabatan, bidang_kepakaran, email, foto_url, tentang, pendidikan, publikasi, penelitian, pengabdian } = req.body;
    await db_1.db.query(`INSERT INTO dosen (nama, jabatan, bidang_kepakaran, email, foto_url, tentang, pendidikan, publikasi, penelitian, pengabdian) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nama, jabatan || '', bidang_kepakaran || '', email || '', foto_url || '', tentang || '', pendidikan || '', publikasi || '', penelitian || '', pengabdian || '']);
    res.status(201).json({ message: 'Data dosen berhasil ditambahkan' });
}));
apiRouter.delete('/dosen/:id', asyncHandler(async (req, res) => {
    await db_1.db.query('DELETE FROM dosen WHERE id = ?', [req.params.id]);
    res.json({ message: 'Data dosen terhapus' });
}));
app.use('/api', apiRouter);
// ==========================================
// 2. DASHBOARD ADMIN SIDEBAR (SSR HTML)
// ==========================================
app.get('/', async (req, res) => {
    try {
        const [pengumuman] = await db_1.db.query('SELECT * FROM pengumuman ORDER BY tanggal DESC');
        const [penelitian] = await db_1.db.query('SELECT * FROM penelitian ORDER BY id DESC');
        const [pengabdian] = await db_1.db.query('SELECT * FROM pengabdian ORDER BY id DESC');
        const [dokumen] = await db_1.db.query('SELECT * FROM dokumen ORDER BY id DESC');
        const [events] = await db_1.db.query('SELECT * FROM events ORDER BY tanggal_event ASC');
        const [dosenList] = await db_1.db.query('SELECT * FROM dosen ORDER BY id DESC');
        const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Dashboard Admin LPPM UPITRA - Backend</title>
        <link rel="icon" type="image/png" href="/logo.png?v=1">
        <link rel="shortcut icon" href="/logo.png?v=1" type="image/x-icon">

        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          body { display: flex; height: 100vh; background-color: #f4f6f9; color: #333; overflow: hidden; }

          .sidebar { width: 260px; background-color: #002244; color: #fff; display: flex; flex-direction: column; flex-shrink: 0; }
          .sidebar-header { padding: 20px 15px; background-color: #001830; display: flex; align-items: center; justify-content: center; gap: 12px; border-bottom: 1px solid #003366; }
          .sidebar-header img { width: 42px; height: 42px; object-fit: contain; flex-shrink: 0; }
          .sidebar-header h2 { font-size: 18px; color: #fff; margin-bottom: 4px; }
          .sidebar-header span { font-size: 12px; color: #88aacc; display: block; }
          
          .sidebar-menu { list-style: none; padding: 15px 0; flex-grow: 1; overflow-y: auto; }
          .sidebar-menu li a { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #cbd5e1; text-decoration: none; font-size: 14px; font-weight: 500; transition: 0.2s; }
          .sidebar-menu li a:hover, .sidebar-menu li a.active { background-color: #003366; color: #fff; border-left: 4px solid #0088ff; }

          .sidebar-footer { padding: 15px; background-color: #001830; font-size: 12px; text-align: center; color: #88aacc; }

          .main-content { flex-grow: 1; display: flex; flex-direction: column; overflow-y: auto; }
          .topbar { background-color: #fff; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
          .topbar h1 { font-size: 20px; color: #002244; }
          .status-badge { background-color: #28a745; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }

          .content-area { padding: 30px; }
          
          /* STATS WIDGETS */
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 25px; }
          .stat-card { background: white; padding: 15px 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .stat-card h4 { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; }
          .stat-card div { font-size: 22px; font-weight: 800; color: #002244; margin-top: 4px; }

          .panel-section { display: none; }
          .panel-section.active { display: block; }

          .card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 25px; border: 1px solid #e2e8f0; }
          .card h3 { color: #002244; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #003366; padding-bottom: 8px; display: inline-block; }

          .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 15px; }
          label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px; color: #475569; }
          input, textarea, select { width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; outline: none; }

          button.btn-add { background-color: #003366; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; }
          button.btn-add:hover { background-color: #001830; }

          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          th { background-color: #f8fafc; color: #475569; font-weight: 600; }
          tr:hover { background-color: #f1f5f9; }

          .btn-delete { background-color: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; }
          .btn-delete:hover { background-color: #dc2626; }
          
          .btn-save { background-color: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; margin-right: 4px; }
          .btn-save:hover { background-color: #0369a1; }

          .select-status { padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; border: 1px solid #cbd5e1; }
          .input-alasan { padding: 6px 10px; border-radius: 6px; font-size: 12px; border: 1px solid #cbd5e1; width: 100%; }
          .abstrak-text { font-size: 12px; color: #475569; background: #f8fafc; padding: 8px; border-radius: 6px; margin-top: 4px; border: 1px solid #e2e8f0; }
          .img-avatar { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
        </style>
      </head>
      <body>

        <aside class="sidebar">
          <div class="sidebar-header">
            <img src="/logo.png?v=1" alt="Logo UPITRA">
            <div style="text-align: center;">
              <h2>LPPM UPITRA</h2>
              <span>Admin Panel</span>
            </div>
          </div>
          <ul class="sidebar-menu">
            <li><a href="#" id="link-pengumuman" class="active" onclick="showSection('pengumuman', this)">📢 Notice & News</a></li>
            <li><a href="#" id="link-events" onclick="showSection('events', this)">📅 Events / Agenda</a></li>
            <li><a href="#" id="link-dokumen" onclick="showSection('dokumen', this)">📁 Guides & Templates</a></li>
            <li><a href="#" id="link-penelitian" onclick="showSection('penelitian', this)">🔬 Proposal Submission (Riset)</a></li>
            <li><a href="#" id="link-pengabdian" onclick="showSection('pengabdian', this)">🤝 Pengabdian (PkM)</a></li>
            <li><a href="#" id="link-dosen" onclick="showSection('dosen', this)">👨‍🏫 Profil Dosen (Lecturer)</a></li>
          </ul>
          <div class="sidebar-footer">
            LPPM UPITRA v1.0 &copy; 2026
          </div>
        </aside>

        <main class="main-content">
          <header class="topbar">
            <h1 id="page-title">Manajemen Notice & News</h1>
            <span class="status-badge">● Database Connected</span>
          </header>

          <div class="content-area">

            <!-- KARTU RINGKASAN RINGKAS DI ATAS DASHBOARD -->
            <div class="stats-grid">
              <div class="stat-card">
                <h4>Total Riset</h4>
                <div>${penelitian.length}</div>
              </div>
              <div class="stat-card">
                <h4>Total PkM</h4>
                <div>${pengabdian.length}</div>
              </div>
              <div class="stat-card">
                <h4>Total Dosen</h4>
                <div>${dosenList.length}</div>
              </div>
              <div class="stat-card">
                <h4>Pengumuman</h4>
                <div>${pengumuman.length}</div>
              </div>
            </div>

            <!-- 1. PENGUMUMAN / NOTICE & NEWS -->
            <section id="sec-pengumuman" class="panel-section active">
              <div class="card">
                <h3>+ Tambah Notice / News Baru</h3>
                <form onsubmit="saveData(event, '/api/news', {judul: this.judul.value, isi: this.isi.value, tanggal: this.tanggal.value})">
                  <div class="form-grid">
                    <div><label>Judul Pengumuman/Berita</label><input type="text" name="judul" required></div>
                    <div><label>Tanggal</label><input type="date" name="tanggal" required></div>
                  </div>
                  <div style="margin-bottom: 15px;"><label>Isi Berita</label><textarea name="isi" rows="3" required></textarea></div>
                  <button type="submit" class="btn-add">Simpan Berita</button>
                </form>
              </div>
              <div class="card">
                <h3>Daftar Notice & News</h3>
                <table>
                  <thead><tr><th>Judul</th><th>Isi</th><th>Tanggal</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${pengumuman.map((item) => `
                      <tr>
                        <td><strong>${escapeHtml(item.judul)}</strong></td>
                        <td>${escapeHtml(item.isi)}</td>
                        <td>${new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                        <td><button onclick="deleteData('/api/news/${item.id}')" class="btn-delete">Hapus</button></td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 2. EVENTS / AGENDA -->
            <section id="sec-events" class="panel-section">
              <div class="card">
                <h3>+ Tambah Event / Agenda Kegiatan</h3>
                <form onsubmit="saveData(event, '/api/events', {judul: this.judul.value, lokasi: this.lokasi.value, tanggal_event: this.tanggal_event.value, keterangan: this.keterangan.value})">
                  <div class="form-grid">
                    <div><label>Judul Event</label><input type="text" name="judul" required></div>
                    <div><label>Lokasi Kegiatan</label><input type="text" name="lokasi" required></div>
                    <div><label>Tanggal Event</label><input type="date" name="tanggal_event" required></div>
                  </div>
                  <div style="margin-bottom: 15px;"><label>Keterangan / Deskripsi Event</label><textarea name="keterangan" rows="2"></textarea></div>
                  <button type="submit" class="btn-add">Simpan Event</button>
                </form>
              </div>
              <div class="card">
                <h3>Daftar Agenda Kegiatan LPPM</h3>
                <table>
                  <thead><tr><th>Judul Event</th><th>Lokasi</th><th>Tanggal</th><th>Keterangan</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${events.map((item) => `
                      <tr>
                        <td><strong>${escapeHtml(item.judul)}</strong></td>
                        <td>${escapeHtml(item.lokasi)}</td>
                        <td>${new Date(item.tanggal_event).toLocaleDateString('id-ID')}</td>
                        <td>${escapeHtml(item.keterangan) || '-'}</td>
                        <td><button onclick="deleteData('/api/events/${item.id}')" class="btn-delete">Hapus</button></td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 3. GUIDES & TEMPLATES -->
            <section id="sec-dokumen" class="panel-section">
              <div class="card">
                <h3>+ Tambah File Panduan / Template</h3>
                <form onsubmit="saveData(event, '/api/guides', {nama_dokumen: this.nama_dokumen.value, kategori: this.kategori.value, url_download: this.url_download.value})">
                  <div class="form-grid">
                    <div><label>Nama Dokumen</label><input type="text" name="nama_dokumen" required></div>
                    <div><label>Kategori</label><input type="text" name="kategori" placeholder="Panduan Proposal / Template Laporan" required></div>
                    <div><label>URL Download File</label><input type="text" name="url_download" required></div>
                  </div>
                  <button type="submit" class="btn-add">Simpan Dokumen</button>
                </form>
              </div>
              <div class="card">
                <h3>Daftar Guides & Panduan</h3>
                <table>
                  <thead><tr><th>Dokumen</th><th>Kategori</th><th>Download</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${dokumen.map((item) => `
                      <tr>
                        <td><strong>${escapeHtml(item.nama_dokumen)}</strong></td>
                        <td>${escapeHtml(item.kategori)}</td>
                        <td><a href="${escapeHtml(item.url_download)}" target="_blank" rel="noopener noreferrer">Unduh File</a></td>
                        <td><button onclick="deleteData('/api/guides/${item.id}')" class="btn-delete">Hapus</button></td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 4. PROPOSAL SUBMISSION (PENELITIAN) -->
            <section id="sec-penelitian" class="panel-section">
              <div class="card">
                <h3>Daftar Pengajuan Proposal Riset dari Dosen</h3>
                <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Admin dapat melihat ringkasan/abstrak usulan, memperbarui status, serta memberikan catatan/alasan.</p>
                <table>
                  <thead><tr><th>Judul & Abstrak Riset</th><th>Ketua / Dosen</th><th>Status Proposal</th><th>Alasan / Catatan Admin</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${penelitian.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Belum ada proposal masuk dari Dosen.</td></tr>' :
            penelitian.map((item) => `
                      <tr>
                        <td style="width:30%;">
                          <strong>${escapeHtml(item.judul)}</strong>
                          <div class="abstrak-text"><strong>Abstrak:</strong> ${escapeHtml(item.abstrak || 'Tidak ada ringkasan.')}</div>
                        </td>
                        <td>${escapeHtml(item.ketua)}</td>
                        <td style="width:15%;">
                          <select id="status-penelitian-${item.id}" class="select-status">
                            <option value="Review" ${item.status === 'Review' ? 'selected' : ''}>⏳ Review</option>
                            <option value="Disetujui" ${item.status === 'Disetujui' ? 'selected' : ''}>✅ Disetujui</option>
                            <option value="Berjalan" ${item.status === 'Berjalan' ? 'selected' : ''}>🚀 Berjalan</option>
                            <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>🎉 Selesai</option>
                            <option value="Ditolak" ${item.status === 'Ditolak' ? 'selected' : ''}>❌ Ditolak</option>
                          </select>
                        </td>
                        <td style="width:25%;">
                          <input type="text" id="alasan-penelitian-${item.id}" class="input-alasan" value="${escapeHtml(item.alasan || '')}" placeholder="Contoh: Tidak memenuhi syarat">
                        </td>
                        <td style="width:15%;">
                          <button onclick="saveStatusAlasan('/api/penelitian/', ${item.id}, 'penelitian')" class="btn-save">Simpan</button>
                          <button onclick="deleteData('/api/penelitian/${item.id}')" class="btn-delete">Hapus</button>
                        </td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 5. PENGABDIAN (PKM) -->
            <section id="sec-pengabdian" class="panel-section">
              <div class="card">
                <h3>Daftar Pengajuan PkM dari Dosen</h3>
                <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Admin dapat memperbarui status usulan PkM serta memberikan catatan/alasan.</p>
                <table>
                  <thead><tr><th>Judul Kegiatan & Objek Mitra</th><th>Ketua Pelaksana</th><th>Status PkM</th><th>Alasan / Catatan Admin</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${pengabdian.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Belum ada usulan PkM masuk dari Dosen.</td></tr>' :
            pengabdian.map((item) => `
                      <tr>
                        <td style="width:30%;">
                          <strong>${escapeHtml(item.judul)}</strong>
                          <div class="abstrak-text"><strong>Lokasi Mitra:</strong> ${escapeHtml(item.lokasi || '-')}</div>
                        </td>
                        <td>${escapeHtml(item.ketua)}</td>
                        <td style="width:15%;">
                          <select id="status-pengabdian-${item.id}" class="select-status">
                            <option value="Review" ${item.status === 'Review' || !item.status ? 'selected' : ''}>⏳ Review</option>
                            <option value="Disetujui" ${item.status === 'Disetujui' ? 'selected' : ''}>✅ Disetujui</option>
                            <option value="Ditolak" ${item.status === 'Ditolak' ? 'selected' : ''}>❌ Ditolak</option>
                          </select>
                        </td>
                        <td style="width:25%;">
                          <input type="text" id="alasan-pengabdian-${item.id}" class="input-alasan" value="${escapeHtml(item.alasan || '')}" placeholder="Contoh: Lokasi mitra disetujui">
                        </td>
                        <td style="width:15%;">
                          <button onclick="saveStatusAlasan('/api/pengabdian/', ${item.id}, 'pengabdian')" class="btn-save">Simpan</button>
                          <button onclick="deleteData('/api/pengabdian/${item.id}')" class="btn-delete">Hapus</button>
                        </td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 6. PROFIL DOSEN -->
            <section id="sec-dosen" class="panel-section">
              <div class="card">
                <h3>+ Tambah Data Profil Dosen Baru</h3>
                <form onsubmit="saveData(event, '/api/dosen', {
                  nama: this.nama.value,
                  jabatan: this.jabatan.value,
                  bidang_kepakaran: this.bidang_kepakaran.value,
                  email: this.email.value,
                  foto_url: this.foto_url.value,
                  tentang: this.tentang.value,
                  pendidikan: this.pendidikan.value,
                  publikasi: this.publikasi.value,
                  penelitian: this.penelitian.value,
                  pengabdian: this.pengabdian.value
                })">
                  <div class="form-grid">
                    <div><label>Nama Lengkap & Gelar</label><input type="text" name="nama" placeholder="Contoh: Vincentia Anindha, S.Ak., M.Sc." required></div>
                    <div><label>Jabatan Akademik</label><input type="text" name="jabatan" placeholder="Contoh: Asisten Ahli"></div>
                    <div><label>Bidang Kepakaran</label><input type="text" name="bidang_kepakaran" placeholder="Contoh: Financial Management"></div>
                    <div><label>Email Dosen</label><input type="email" name="email" placeholder="dosen@upitra.ac.id"></div>
                    <div><label>URL Foto Profil</label><input type="text" name="foto_url" placeholder="https://domain.com/foto.jpg"></div>
                  </div>
                  
                  <div style="margin-bottom: 12px;"><label>Biografi Sederhana (Tentang Dosen)</label><textarea name="tentang" rows="2" placeholder="Biografi singkat dosen..."></textarea></div>
                  <div style="margin-bottom: 12px;"><label>Riwayat Pendidikan</label><textarea name="pendidikan" rows="2" placeholder="S1: Universitas X, S2: Universitas Y"></textarea></div>
                  <div style="margin-bottom: 12px;"><label>Jurnal Scopus / Publikasi</label><textarea name="publikasi" rows="2" placeholder="Judul artikel jurnal Scopus / SINTA..."></textarea></div>
                  <div style="margin-bottom: 12px;"><label>Riwayat Penelitian</label><textarea name="penelitian" rows="2" placeholder="Daftar riset yang dilakukan..."></textarea></div>
                  <div style="margin-bottom: 15px;"><label>Riwayat Pengabdian (PkM)</label><textarea name="pengabdian" rows="2" placeholder="Daftar kegiatan PkM..."></textarea></div>

                  <button type="submit" class="btn-add">Simpan Profil Dosen</button>
                </form>
              </div>

              <div class="card">
                <h3>Daftar Profil Dosen UPITRA</h3>
                <table>
                  <thead><tr><th>Foto</th><th>Nama & Jabatan</th><th>Kepakaran</th><th>Email</th><th>Aksi</th></tr></thead>
                  <tbody>
                    ${dosenList.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Belum ada data dosen.</td></tr>' :
            dosenList.map((item) => `
                      <tr>
                        <td>
                          <img src="${escapeHtml(item.foto_url) || 'https://via.placeholder.com/150'}" class="img-avatar" alt="Foto">
                        </td>
                        <td>
                          <strong>${escapeHtml(item.nama)}</strong>
                          <div style="font-size:12px; color:#64748b;">${escapeHtml(item.jabatan || 'Dosen')}</div>
                        </td>
                        <td>${escapeHtml(item.bidang_kepakaran || '-')}</td>
                        <td>${escapeHtml(item.email || '-')}</td>
                        <td><button onclick="deleteData('/api/dosen/${item.id}')" class="btn-delete">Hapus</button></td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>

        <script>
          function showSection(sectionId, linkEl) {
            document.querySelectorAll('.panel-section').forEach(sec => sec.classList.remove('active'));
            document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));

            document.getElementById('sec-' + sectionId).classList.add('active');
            if (linkEl) {
              linkEl.classList.add('active');
            } else {
              const link = document.getElementById('link-' + sectionId);
              if (link) link.classList.add('active');
            }

            localStorage.setItem('activeSection', sectionId);

            const titles = {
              'pengumuman': 'Manajemen Notice & News',
              'events': 'Manajemen Events / Agenda',
              'dokumen': 'Manajemen Guides & Templates',
              'penelitian': 'Proposal Submission (Penelitian)',
              'pengabdian': 'Manajemen Pengabdian (PkM)',
              'dosen': 'Sistem Informasi Profil Dosen'
            };
            document.getElementById('page-title').innerText = titles[sectionId] || 'Dashboard Admin';
          }

          async function saveStatusAlasan(urlPrefix, id, type) {
            const statusVal = document.getElementById('status-' + type + '-' + id).value;
            const alasanVal = document.getElementById('alasan-' + type + '-' + id).value;

            const res = await fetch(urlPrefix + id + '/status', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: statusVal, alasan: alasanVal })
            });
            if (res.ok) {
              alert('Status dan Catatan berhasil disimpan!');
            } else {
              alert('Gagal menyimpan perubahan');
            }
          }

          async function saveData(e, url, bodyData) {
            e.preventDefault();
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyData)
            });
            if (res.ok) location.reload();
            else alert('Gagal menyimpan data');
          }

          async function deleteData(url) {
            if (!confirm('Yakin ingin menghapus data ini?')) return;
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) location.reload();
            else alert('Gagal menghapus data');
          }
        </script>
      </body>
      </html>
    `;
        res.send(html);
    }
    catch (error) {
        console.error("DETAIL ERROR DASHBOARD:", error);
        res.status(500).send("Error loading dashboard: " + error.message);
    }
});
app.listen(PORT, () => {
    console.log(`Server Backend LPPM UPITRA berjalan di http://localhost:${PORT}`);
});
