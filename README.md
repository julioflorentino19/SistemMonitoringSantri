# Sistem Informasi Data Santri - Masjid Nurul Iman

## 📋 Deskripsi

Sistem Informasi Data Santri berbasis web untuk Masjid Nurul Iman yang dikembangkan menggunakan **Metode Waterfall**. Sistem ini dirancang untuk monitoring hafalan Al-Quran, kehadiran, dan iuran bulanan santri dengan fitur CRUD lengkap dan database persisten.

## ✨ Fitur Utama

### 🔐 Sistem Login
- Autentikasi pengguna dengan username dan password
- 3 role pengguna: Admin, Ustadz, Pengurus
- Session management dengan localStorage
- **Akun Demo:**
  - admin / admin123
  - ustadz / ustadz123
  - pengurus / pengurus123

### 👥 Data Santri (CRUD Lengkap)
- ✅ **Tambah** santri baru dengan form lengkap
- ✅ **Edit** data santri yang sudah ada
- ✅ **Hapus** data santri dengan konfirmasi
- ✅ **Lihat Detail** profil santri
- ✅ **Pencarian** berdasarkan nama atau NIS
- ✅ **Filter** berdasarkan kelas
- Data tersimpan permanen di localStorage

### 📖 Monitoring Hafalan (CRUD Lengkap)
- ✅ **Catat** hafalan baru per santri
- ✅ **Edit** data hafalan
- ✅ **Hapus** data hafalan
- ✅ **Filter** berdasarkan santri dan status
- Status: Lancar, Kurang Lancar, Belum Lancar
- Penilaian 0-100
- Data tersimpan permanen

### 📋 Kehadiran (CRUD Lengkap)
- ✅ **Input** kehadiran harian
- ✅ **Edit** status kehadiran
- ✅ **Hapus** data kehadiran
- ✅ **Filter** berdasarkan tanggal
- Status: Hadir, Izin, Sakit, Alpha
- Rekap kehadiran per santri
- Data tersimpan permanen

### 💰 Iuran Bulanan (CRUD Lengkap)
- ✅ **Catat** iuran bulanan
- ✅ **Edit** data iuran
- ✅ **Hapus** data iuran
- ✅ **Bayar** iuran (update status)
- Status: Lunas, Sebagian, Belum Bayar
- Metode: Tunai, Transfer, QRIS
- Ringkasan keuangan otomatis
- Data tersimpan permanen

### 📊 Laporan & Analisis
- Laporan kehadiran dengan persentase
- Progress hafalan per santri
- Ringkasan keuangan iuran
- Grafik dan statistik real-time

## 🗄️ Database

### Frontend Database (localStorage)
Website menggunakan localStorage sebagai database persisten:
- Data tersimpan di browser
- Tetap ada setelah refresh
- Bisa di-export/import
- Kapasitas: ~5-10MB

### Backend Database (MySQL)
File SQL tersedia di folder `database/`:
- `schema.sql` - Struktur database lengkap
- `seed.sql` - Data sample untuk testing

**Struktur Tabel:**
1. `users` - Data pengguna sistem
2. `santri` - Data santri
3. `hafalan` - Record hafalan
4. `kehadiran` - Absensi harian
5. `iuran` - Pembayaran iuran
6. `log_aktivitas` - Audit trail

**Views:**
- `v_ringkasan_kehadiran`
- `v_ringkasan_hafalan`
- `v_ringkasan_iuran`

**Stored Procedures:**
- `sp_laporan_bulanan`

**Triggers:**
- `trg_update_status_iuran`

## 🚀 Instalasi & Penggunaan

### 1. Jalankan Website (Frontend Only)

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

Website akan berjalan di `http://localhost:5173`

### 2. Setup Database MySQL (Opsional)

```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan schema
source database/schema.sql;

# Jalankan seed data
source database/seed.sql;
```

### 3. Deploy ke Hosting

```bash
# Build production
npm run build

# Upload folder 'dist' ke hosting
# File akan ada di dist/index.html
```

## 📱 Responsive Design

Website dirancang dengan pendekatan **mobile-first**:
- ✅ Bottom navigation untuk mobile
- ✅ Sidebar untuk desktop
- ✅ Touch-friendly interface
- ✅ Optimized untuk berbagai ukuran layar
- ✅ Safe area support untuk notch

## 🛠️ Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Database | localStorage (frontend) / MySQL (backend) |
| Icons | SVG Inline |

## 📊 Metode Waterfall

Pengembangan sistem mengikuti 5 tahapan Waterfall:

1. **Analisis Kebutuhan** ✓
   - Identifikasi kebutuhan pengguna
   - Dokumentasi requirements

2. **Desain** ✓
   - Perancangan database
   - UI/UX design
   - System architecture

3. **Implementasi** ✓
   - Coding frontend
   - Database setup
   - Integration testing

4. **Testing** ✓
   - Unit testing
   - Integration testing
   - User acceptance testing

5. **Deployment** ✓
   - Production build
   - Documentation
   - User training

## 🔒 Keamanan

- ✅ Password validation
- ✅ Session management
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention (untuk backend)

## 💾 Backup & Restore

### Export Data
```javascript
// Di browser console
const data = {
  users: JSON.parse(localStorage.getItem('db_users_v2')),
  santri: JSON.parse(localStorage.getItem('db_santri_v2')),
  hafalan: JSON.parse(localStorage.getItem('db_hafalan_v2')),
  kehadiran: JSON.parse(localStorage.getItem('db_kehadiran_v2')),
  iuran: JSON.parse(localStorage.getItem('db_iuran_v2')),
};
console.log(JSON.stringify(data));
// Copy dan simpan ke file
```

### Import Data
```javascript
// Di browser console
const data = { /* paste data yang di-export */ };
localStorage.setItem('db_users_v2', JSON.stringify(data.users));
localStorage.setItem('db_santri_v2', JSON.stringify(data.santri));
localStorage.setItem('db_hafalan_v2', JSON.stringify(data.hafalan));
localStorage.setItem('db_kehadiran_v2', JSON.stringify(data.kehadiran));
localStorage.setItem('db_iuran_v2', JSON.stringify(data.iuran));
location.reload();
```

### Reset Database
```javascript
// Di browser console
localStorage.clear();
location.reload();
```

## 📝 Catatan Penting

1. **Data Persistence**: Data tersimpan di localStorage browser. Jika browser di-clear, data akan hilang. Selalu backup data secara berkala.

2. **Multi-Device**: Data tidak tersinkronisasi antar device. Setiap device memiliki data terpisah.

3. **Kapasitas**: localStorage memiliki batas ~5-10MB. Untuk data besar, gunakan MySQL backend.

4. **Production**: Untuk penggunaan production, disarankan menggunakan backend API dengan MySQL database.

## 📄 Lisensi

© 2024 Masjid Nurul Iman. All rights reserved.

## 👥 Tim Pengembang

Sistem ini dikembangkan sebagai implementasi metode Waterfall untuk:
- Perancangan database yang terstruktur
- Pengembangan frontend yang responsif
- Implementasi fitur CRUD lengkap
- Pembuatan laporan dan analisis data
- Dokumentasi teknis lengkap

---

**Status**: ✅ Siap Deploy & Production Ready

**Versi**: 2.0.0

**Last Update**: 2024
