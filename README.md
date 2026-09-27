# Sistem Informasi Data Santri - Masjid Nurul Iman

## 📋 Deskripsi

Sistem Informasi Data Santri berbasis Mobile Web untuk Masjid Nurul Iman yang dikembangkan menggunakan **Metode Waterfall**. Sistem ini dirancang untuk monitoring hafalan Al-Quran, kehadiran, dan iuran bulanan santri.

## 🏗️ Arsitektur

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Desain:** Mobile-first responsive

### Backend (Database)
- **Database:** MySQL 8.0+
- **Bahasa:** SQL
- **Fitur:** Views, Stored Procedures, Triggers

## 📁 Struktur Proyek

```
├── database/
│   ├── schema.sql          # Struktur database lengkap
│   ├── seed.sql            # Data awal (sample data)
│   └── api-docs.md         # Dokumentasi REST API
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx   # Halaman login
│   │   ├── Dashboard.tsx   # Dashboard utama
│   │   ├── Sidebar.tsx     # Navigasi sidebar
│   │   ├── SantriPage.tsx  # Data santri
│   │   ├── HafalanPage.tsx # Monitoring hafalan
│   │   ├── KehadiranPage.tsx # Absensi kehadiran
│   │   ├── IuranPage.tsx   # Iuran bulanan
│   │   └── LaporanPage.tsx # Laporan & analisis
│   ├── types.ts            # TypeScript interfaces
│   ├── data.ts             # Data sample
│   ├── App.tsx             # Root component
│   └── index.css           # Global styles
└── README.md
```

## 🗄️ Database Schema

### Tabel Utama:
1. **users** - Data pengguna sistem (admin, pengurus, ustadz)
2. **santri** - Data santri lengkap
3. **hafalan** - Record hafalan Al-Quran
4. **kehadiran** - Absensi harian santri
5. **iuran** - Pembayaran iuran bulanan
6. **log_aktivitas** - Audit trail sistem

### Views:
- `v_ringkasan_kehadiran` - Rekap kehadiran per santri
- `v_ringkasan_hafalan` - Rekap hafalan per santri
- `v_ringkasan_iuran` - Rekap iuran per santri

### Stored Procedures:
- `sp_laporan_bulanan` - Generate laporan bulanan

### Triggers:
- `trg_update_status_iuran` - Auto-update status pembayaran

## 🚀 Instalasi

### 1. Setup Database

```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan schema
source database/schema.sql;

# Jalankan seed data
source database/seed.sql;
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

### 3. Setup Backend (Opsional)

Untuk menghubungkan dengan backend, gunakan dokumentasi API di `database/api-docs.md`

## 🔑 Login Demo

- **Username:** admin (atau apapun)
- **Password:** admin123 (atau apapun)

## 📱 Fitur Utama

### 1. Dashboard
- Statistik ringkas semua modul
- Grafik progress hafalan
- Ringkasan iuran
- Aktivitas terbaru

### 2. Data Santri
- CRUD data santri
- Pencarian dan filter
- Detail profil santri
- Filter berdasarkan kelas

### 3. Monitoring Hafalan
- Input hafalan harian
- Status: Lancar, Kurang Lancar, Belum Lancar
- Penilaian (0-100)
- Filter per santri dan status
- Progress per santri

### 4. Kehadiran
- Absensi harian
- Status: Hadir, Izin, Sakit, Alpha
- Rekap kehadiran per santri
- Persentase kehadiran
- Grafik harian

### 5. Iuran Bulanan
- Pencatatan pembayaran
- Metode: Tunai, Transfer, QRIS
- Status: Lunas, Sebagian, Belum Bayar
- Ringkasan keuangan
- Progress pengumpulan

### 6. Laporan
- Laporan kehadiran dengan grafik
- Laporan hafalan per santri
- Laporan keuangan iuran
- Analisis dan statistik

## 📊 Metode Waterfall

Pengembangan sistem mengikuti 5 tahapan Waterfall:

1. **Analisis Kebutuhan** - Identifikasi kebutuhan pengguna
2. **Desain** - Perancangan database dan UI/UX
3. **Implementasi** - Coding frontend dan database
4. **Testing** - Pengujian fungsionalitas
5. **Deployment** - Deployment ke server

## 🔒 Keamanan

- Password di-hash dengan bcrypt
- Session management
- Role-based access control (Admin, Pengurus, Ustadz)
- Audit trail (log aktivitas)
- SQL injection prevention

## 📱 Mobile Responsive

Sistem dirancang dengan pendekatan mobile-first:
- Bottom navigation untuk mobile
- Sidebar untuk desktop
- Touch-friendly interface
- Safe area support untuk notch/home indicator
- Optimized untuk berbagai ukuran layar

## 🛠️ Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Database | MySQL 8.0 |
| Icons | SVG Inline |
| Build | Vite |

## 📝 Lisensi

© 2024 Masjid Nurul Iman. All rights reserved.

## 👥 Tim Pengembang

Sistem ini dikembangkan sebagai bagian dari tugas akhir dengan menggunakan metode Waterfall untuk:
- Perancangan database yang terstruktur
- Pengembangan frontend yang responsif
- Implementasi fitur CRUD lengkap
- Pembuatan laporan dan analisis data

---

**Catatan:** Untuk penggunaan production, pastikan untuk:
1. Mengganti password default
2. Mengaktifkan HTTPS
3. Melakukan backup database secara berkala
4. Mengupdate dependensi secara rutin
5. Melakukan testing keamanan
