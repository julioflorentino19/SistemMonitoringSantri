// ============================================================
// LOCAL STORAGE DATABASE - Simulasi Backend
// ============================================================

import { Santri, HafalanRecord, KehadiranRecord, IuranRecord, User } from './types';

const KEYS = {
  USERS: 'db_users',
  SANTRI: 'db_santri',
  HAFALAN: 'db_hafalan',
  KEHADIRAN: 'db_kehadiran',
  IURAN: 'db_iuran',
  SESSION: 'db_session',
};

// Helper: Get from localStorage
function get<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

// Helper: Set to localStorage
function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Helper: Generate ID
function genId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
}

// ============================================================
// DEFAULT DATA
// ============================================================
const defaultUsers: User[] = [
  { id: 'U001', username: 'admin', password: 'admin123', namaLengkap: 'Ahmad Syaiful', email: 'admin@nuruliman.or.id', role: 'admin' },
  { id: 'U002', username: 'ustadz', password: 'ustadz123', namaLengkap: 'Ustadz Ali Imron', email: 'ali@nuruliman.or.id', role: 'ustadz' },
  { id: 'U003', username: 'pengurus', password: 'pengurus123', namaLengkap: 'Budi Santoso', email: 'budi@nuruliman.or.id', role: 'pengurus' },
];

const defaultSantri: Santri[] = [
  { id: 'S001', nis: '2023001', nama: 'Ahmad Fauzi Rahman', namaPanggilan: 'Fauzi', jenisKelamin: 'L', tempatLahir: 'Jakarta', tanggalLahir: '2012-03-15', alamat: 'Jl. Mawar No. 5 RT 03/02', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567890', namaWali: 'H. Rahman', kelas: 'Kelas 1', tanggalDaftar: '2023-01-15', status: 'aktif' },
  { id: 'S002', nis: '2023002', nama: 'Siti Aisyah Putri', namaPanggilan: 'Aisyah', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2014-07-22', alamat: 'Jl. Melati No. 12 RT 01/04', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567891', namaWali: 'Hj. Fatimah', kelas: 'Kelas 1', tanggalDaftar: '2023-02-20', status: 'aktif' },
  { id: 'S003', nis: '2023003', nama: 'Muhammad Rizki Aditya', namaPanggilan: 'Rizki', jenisKelamin: 'L', tempatLahir: 'Bogor', tanggalLahir: '2010-11-08', alamat: 'Jl. Anggrek No. 8 RT 02/01', kelurahan: 'Curug', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567892', namaWali: 'Ir. Aditya', kelas: 'Kelas 2', tanggalDaftar: '2023-01-10', status: 'aktif' },
  { id: 'S004', nis: '2023004', nama: 'Fatimah Zahra Salsabila', namaPanggilan: 'Fatimah', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2013-05-30', alamat: 'Jl. Kenanga No. 3 RT 05/03', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567893', namaWali: 'Drs. Salsabila', kelas: 'Kelas 1', tanggalDaftar: '2023-03-05', status: 'aktif' },
  { id: 'S005', nis: '2023005', nama: 'Abdullah Hakim Pratama', namaPanggilan: 'Abdullah', jenisKelamin: 'L', tempatLahir: 'Depok', tanggalLahir: '2011-09-14', alamat: 'Jl. Dahlia No. 15 RT 04/02', kelurahan: 'Sukmajaya', kecamatan: 'Sukmajaya', kota: 'Depok', noHpWali: '081234567894', namaWali: 'H. Pratama', kelas: 'Kelas 2', tanggalDaftar: '2023-01-20', status: 'aktif' },
  { id: 'S006', nis: '2023006', nama: 'Khadijah Amina Rahma', namaPanggilan: 'Khadijah', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2014-01-25', alamat: 'Jl. Tulip No. 7 RT 02/05', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567895', namaWali: 'Hj. Rahma', kelas: 'Kelas 1', tanggalDaftar: '2023-04-01', status: 'aktif' },
  { id: 'S007', nis: '2023007', nama: 'Umar Faruq Nugroho', namaPanggilan: 'Umar', jenisKelamin: 'L', tempatLahir: 'Bogor', tanggalLahir: '2009-12-03', alamat: 'Jl. Sakura No. 9 RT 03/01', kelurahan: 'Curug', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567896', namaWali: 'H. Nugroho', kelas: 'Kelas 3', tanggalDaftar: '2022-08-15', status: 'aktif' },
  { id: 'S008', nis: '2023008', nama: 'Maryam Shalihah Dewi', namaPanggilan: 'Maryam', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2012-06-18', alamat: 'Jl. Kamboja No. 4 RT 01/03', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567897', namaWali: 'Hj. Dewi', kelas: 'Kelas 2', tanggalDaftar: '2023-02-10', status: 'aktif' },
  { id: 'S009', nis: '2023009', nama: 'Ibrahim Adha Wijaya', namaPanggilan: 'Ibrahim', jenisKelamin: 'L', tempatLahir: 'Depok', tanggalLahir: '2010-04-07', alamat: 'Jl. Cempaka No. 11 RT 05/01', kelurahan: 'Sukmajaya', kecamatan: 'Sukmajaya', kota: 'Depok', noHpWali: '081234567898', namaWali: 'H. Wijaya', kelas: 'Kelas 2', tanggalDaftar: '2023-01-25', status: 'aktif' },
  { id: 'S010', nis: '2023010', nama: 'Aisyah Putri Ramadhani', namaPanggilan: 'Aisyah P', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2013-10-12', alamat: 'Jl. Flamboyan No. 6 RT 02/04', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567899', namaWali: 'Hj. Ramadhani', kelas: 'Kelas 1', tanggalDaftar: '2023-05-01', status: 'aktif' },
  { id: 'S011', nis: '2023011', nama: 'Yusuf Mansur Hakim', namaPanggilan: 'Yusuf', jenisKelamin: 'L', tempatLahir: 'Bogor', tanggalLahir: '2011-02-28', alamat: 'Jl. Mawar Indah No. 2 RT 03/02', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567810', namaWali: 'H. Hakim', kelas: 'Kelas 3', tanggalDaftar: '2022-09-01', status: 'aktif' },
  { id: 'S012', nis: '2023012', nama: 'Zainab Al-Husna', namaPanggilan: 'Zainab', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2012-08-19', alamat: 'Jl. Melati Putih No. 8 RT 01/02', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567811', namaWali: 'Hj. Husna', kelas: 'Kelas 2', tanggalDaftar: '2023-03-15', status: 'aktif' },
];

const defaultHafalan: HafalanRecord[] = [
  { id: 'H001', santriId: 'S001', tanggal: '2024-01-15', surat: 'Al-Baqarah', nomorSurat: 2, ayatMulai: 1, ayatSelesai: 10, juz: 1, halaman: 2, status: 'lancar', nilai: 90, catatan: 'Masya Allah, sangat lancar', penguji: 'Ustadz Ali' },
  { id: 'H002', santriId: 'S001', tanggal: '2024-01-16', surat: 'Al-Baqarah', nomorSurat: 2, ayatMulai: 11, ayatSelesai: 20, juz: 1, halaman: 2, status: 'kurang_lancar', nilai: 70, catatan: 'Perlu mengulang ayat 15-17', penguji: 'Ustadz Ali' },
  { id: 'H003', santriId: 'S002', tanggal: '2024-01-15', surat: 'Al-Fatihah', nomorSurat: 1, ayatMulai: 1, ayatSelesai: 7, juz: 30, halaman: 604, status: 'lancar', nilai: 95, catatan: 'Sudah sangat baik', penguji: 'Ustadz Ali' },
  { id: 'H004', santriId: 'S002', tanggal: '2024-01-16', surat: 'Al-Baqarah', nomorSurat: 2, ayatMulai: 1, ayatSelesai: 5, juz: 1, halaman: 2, status: 'lancar', nilai: 80, catatan: 'Bagus, terus tingkatkan', penguji: 'Ustadz Ali' },
  { id: 'H005', santriId: 'S003', tanggal: '2024-01-15', surat: 'Ali Imran', nomorSurat: 3, ayatMulai: 1, ayatSelesai: 15, juz: 3, halaman: 50, status: 'kurang_lancar', nilai: 60, catatan: 'Perlu latihan tajwid', penguji: 'Ustadz Ali' },
  { id: 'H006', santriId: 'S003', tanggal: '2024-01-16', surat: 'Ali Imran', nomorSurat: 3, ayatMulai: 16, ayatSelesai: 30, juz: 3, halaman: 51, status: 'lancar', nilai: 82, catatan: 'Perkembangan baik', penguji: 'Ustadz Ali' },
  { id: 'H007', santriId: 'S004', tanggal: '2024-01-15', surat: 'An-Nisa', nomorSurat: 4, ayatMulai: 1, ayatSelesai: 10, juz: 4, halaman: 77, status: 'belum_lancar', nilai: 45, catatan: 'Perlu bimbingan lebih', penguji: 'Ustadz Ali' },
  { id: 'H008', santriId: 'S005', tanggal: '2024-01-15', surat: 'Al-Maidah', nomorSurat: 5, ayatMulai: 1, ayatSelesai: 12, juz: 6, halaman: 106, status: 'lancar', nilai: 92, catatan: 'Hafalan sangat kuat', penguji: 'Ustadz Ali' },
  { id: 'H009', santriId: 'S006', tanggal: '2024-01-15', surat: 'An-Nas', nomorSurat: 114, ayatMulai: 1, ayatSelesai: 6, juz: 30, halaman: 604, status: 'lancar', nilai: 98, catatan: 'Sudah sempurna', penguji: 'Ustadz Ali' },
  { id: 'H010', santriId: 'S007', tanggal: '2024-01-15', surat: 'Yasin', nomorSurat: 36, ayatMulai: 1, ayatSelesai: 20, juz: 22, halaman: 440, status: 'lancar', nilai: 88, catatan: 'Masya Allah, konsisten', penguji: 'Ustadz Ali' },
  { id: 'H011', santriId: 'S008', tanggal: '2024-01-16', surat: 'Al-Kahfi', nomorSurat: 18, ayatMulai: 1, ayatSelesai: 10, juz: 15, halaman: 293, status: 'kurang_lancar', nilai: 60, catatan: 'Perlu mengulang', penguji: 'Ustadz Ali' },
  { id: 'H012', santriId: 'S009', tanggal: '2024-01-16', surat: 'Ar-Rahman', nomorSurat: 55, ayatMulai: 1, ayatSelesai: 15, juz: 27, halaman: 531, status: 'lancar', nilai: 87, catatan: 'Tajwid sudah baik', penguji: 'Ustadz Ali' },
  { id: 'H013', santriId: 'S010', tanggal: '2024-01-16', surat: 'Al-Mulk', nomorSurat: 67, ayatMulai: 1, ayatSelesai: 10, juz: 29, halaman: 562, status: 'kurang_lancar', nilai: 62, catatan: 'Masih menghafal', penguji: 'Ustadz Ali' },
  { id: 'H014', santriId: 'S011', tanggal: '2024-01-15', surat: 'Al-Hujurat', nomorSurat: 49, ayatMulai: 1, ayatSelesai: 10, juz: 26, halaman: 515, status: 'lancar', nilai: 85, catatan: 'Hafalan kuat', penguji: 'Ustadz Ali' },
  { id: 'H015', santriId: 'S012', tanggal: '2024-01-16', surat: 'Maryam', nomorSurat: 19, ayatMulai: 1, ayatSelesai: 15, juz: 16, halaman: 305, status: 'kurang_lancar', nilai: 65, catatan: 'Perlu latihan makhraj', penguji: 'Ustadz Ali' },
];

const defaultKehadiran: KehadiranRecord[] = [
  { id: 'K001', santriId: 'S001', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K002', santriId: 'S002', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:25', jamKeluar: '17:00' },
  { id: 'K003', santriId: 'S003', tanggal: '2024-01-15', status: 'sakit', keterangan: 'Demam tinggi', jamMasuk: null, jamKeluar: null },
  { id: 'K004', santriId: 'S004', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K005', santriId: 'S005', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:28', jamKeluar: '17:00' },
  { id: 'K006', santriId: 'S006', tanggal: '2024-01-15', status: 'izin', keterangan: 'Acara keluarga', jamMasuk: null, jamKeluar: null },
  { id: 'K007', santriId: 'S007', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:20', jamKeluar: '17:00' },
  { id: 'K008', santriId: 'S008', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:35', jamKeluar: '17:00' },
  { id: 'K009', santriId: 'S009', tanggal: '2024-01-15', status: 'alpha', keterangan: '', jamMasuk: null, jamKeluar: null },
  { id: 'K010', santriId: 'S010', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K011', santriId: 'S011', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:25', jamKeluar: '17:00' },
  { id: 'K012', santriId: 'S012', tanggal: '2024-01-15', status: 'hadir', keterangan: '', jamMasuk: '15:32', jamKeluar: '17:00' },
  { id: 'K013', santriId: 'S001', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K014', santriId: 'S002', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:28', jamKeluar: '17:00' },
  { id: 'K015', santriId: 'S003', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K016', santriId: 'S004', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:35', jamKeluar: '17:00' },
  { id: 'K017', santriId: 'S005', tanggal: '2024-01-16', status: 'sakit', keterangan: 'Flu dan batuk', jamMasuk: null, jamKeluar: null },
  { id: 'K018', santriId: 'S006', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K019', santriId: 'S007', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:20', jamKeluar: '17:00' },
  { id: 'K020', santriId: 'S008', tanggal: '2024-01-16', status: 'izin', keterangan: 'Kontrol dokter', jamMasuk: null, jamKeluar: null },
  { id: 'K021', santriId: 'S009', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K022', santriId: 'S010', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:30', jamKeluar: '17:00' },
  { id: 'K023', santriId: 'S011', tanggal: '2024-01-16', status: 'hadir', keterangan: '', jamMasuk: '15:25', jamKeluar: '17:00' },
  { id: 'K024', santriId: 'S012', tanggal: '2024-01-16', status: 'alpha', keterangan: '', jamMasuk: null, jamKeluar: null },
];

const defaultIuran: IuranRecord[] = [
  { id: 'I001', santriId: 'S001', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-05', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I002', santriId: 'S002', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-03', metodeBayar: 'transfer', keterangan: 'Transfer BCA' },
  { id: 'I003', santriId: 'S003', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 30000, status: 'sebagian', tanggalBayar: '2024-01-10', metodeBayar: 'tunai', keterangan: 'Sisa akan dibayar minggu depan' },
  { id: 'I004', santriId: 'S004', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-07', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I005', santriId: 'S005', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 0, status: 'belum_bayar', tanggalBayar: null, metodeBayar: 'tunai', keterangan: '' },
  { id: 'I006', santriId: 'S006', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-02', metodeBayar: 'qris', keterangan: 'Bayar via QRIS' },
  { id: 'I007', santriId: 'S007', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-04', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I008', santriId: 'S008', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 25000, status: 'sebagian', tanggalBayar: '2024-01-12', metodeBayar: 'tunai', keterangan: 'Sisa akan dilunasi' },
  { id: 'I009', santriId: 'S009', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 0, status: 'belum_bayar', tanggalBayar: null, metodeBayar: 'tunai', keterangan: '' },
  { id: 'I010', santriId: 'S010', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-06', metodeBayar: 'transfer', keterangan: 'Transfer Mandiri' },
  { id: 'I011', santriId: 'S011', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-08', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I012', santriId: 'S012', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-09', metodeBayar: 'tunai', keterangan: '' },
];

// ============================================================
// INITIALIZE DATABASE
// ============================================================
export function initDatabase() {
  if (!localStorage.getItem(KEYS.USERS)) set(KEYS.USERS, defaultUsers);
  if (!localStorage.getItem(KEYS.SANTRI)) set(KEYS.SANTRI, defaultSantri);
  if (!localStorage.getItem(KEYS.HAFALAN)) set(KEYS.HAFALAN, defaultHafalan);
  if (!localStorage.getItem(KEYS.KEHADIRAN)) set(KEYS.KEHADIRAN, defaultKehadiran);
  if (!localStorage.getItem(KEYS.IURAN)) set(KEYS.IURAN, defaultIuran);
}

// ============================================================
// AUTH
// ============================================================
export const auth = {
  login(username: string, password: string): User | null {
    const users = get<User>(KEYS.USERS, defaultUsers);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout() { localStorage.removeItem(KEYS.SESSION); },
  getSession(): User | null {
    try {
      const s = localStorage.getItem(KEYS.SESSION);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },
};

// ============================================================
// CRUD OPERATIONS
// ============================================================
export const db = {
  // USERS
  getUsers: () => get<User>(KEYS.USERS, defaultUsers),
  addUser: (u: Omit<User, 'id'>) => { const d = get<User>(KEYS.USERS, defaultUsers); const nu = { ...u, id: genId('U') }; d.push(nu); set(KEYS.USERS, d); return nu; },
  updateUser: (id: string, u: Partial<User>) => { const d = get<User>(KEYS.USERS, defaultUsers); const i = d.findIndex(x => x.id === id); if (i >= 0) { d[i] = { ...d[i], ...u }; set(KEYS.USERS, d); } },
  deleteUser: (id: string) => { const d = get<User>(KEYS.USERS, defaultUsers).filter(x => x.id !== id); set(KEYS.USERS, d); },

  // SANTRI
  getSantri: () => get<Santri>(KEYS.SANTRI, defaultSantri),
  addSantri: (s: Partial<Santri>) => { const d = get<Santri>(KEYS.SANTRI, defaultSantri); const ns = { ...s, id: genId('S') } as Santri; d.push(ns); set(KEYS.SANTRI, d); return ns; },
  updateSantri: (id: string, s: Partial<Santri>) => { const d = get<Santri>(KEYS.SANTRI, defaultSantri); const i = d.findIndex(x => x.id === id); if (i >= 0) { d[i] = { ...d[i], ...s }; set(KEYS.SANTRI, d); } },
  deleteSantri: (id: string) => { const d = get<Santri>(KEYS.SANTRI, defaultSantri).filter(x => x.id !== id); set(KEYS.SANTRI, d); },

  // HAFALAN
  getHafalan: () => get<HafalanRecord>(KEYS.HAFALAN, defaultHafalan),
  addHafalan: (h: Partial<HafalanRecord>) => { const d = get<HafalanRecord>(KEYS.HAFALAN, defaultHafalan); const nh = { ...h, id: genId('H') } as HafalanRecord; d.push(nh); set(KEYS.HAFALAN, d); return nh; },
  updateHafalan: (id: string, h: Partial<HafalanRecord>) => { const d = get<HafalanRecord>(KEYS.HAFALAN, defaultHafalan); const i = d.findIndex(x => x.id === id); if (i >= 0) { d[i] = { ...d[i], ...h }; set(KEYS.HAFALAN, d); } },
  deleteHafalan: (id: string) => { const d = get<HafalanRecord>(KEYS.HAFALAN, defaultHafalan).filter(x => x.id !== id); set(KEYS.HAFALAN, d); },

  // KEHADIRAN
  getKehadiran: () => get<KehadiranRecord>(KEYS.KEHADIRAN, defaultKehadiran),
  addKehadiran: (k: Partial<KehadiranRecord>) => { const d = get<KehadiranRecord>(KEYS.KEHADIRAN, defaultKehadiran); const nk = { ...k, id: genId('K') } as KehadiranRecord; d.push(nk); set(KEYS.KEHADIRAN, d); return nk; },
  updateKehadiran: (id: string, k: Partial<KehadiranRecord>) => { const d = get<KehadiranRecord>(KEYS.KEHADIRAN, defaultKehadiran); const i = d.findIndex(x => x.id === id); if (i >= 0) { d[i] = { ...d[i], ...k }; set(KEYS.KEHADIRAN, d); } },
  deleteKehadiran: (id: string) => { const d = get<KehadiranRecord>(KEYS.KEHADIRAN, defaultKehadiran).filter(x => x.id !== id); set(KEYS.KEHADIRAN, d); },

  // IURAN
  getIuran: () => get<IuranRecord>(KEYS.IURAN, defaultIuran),
  addIuran: (i: Partial<IuranRecord>) => { const d = get<IuranRecord>(KEYS.IURAN, defaultIuran); const ni = { ...i, id: genId('I') } as IuranRecord; d.push(ni); set(KEYS.IURAN, d); return ni; },
  updateIuran: (id: string, i: Partial<IuranRecord>) => { const d = get<IuranRecord>(KEYS.IURAN, defaultIuran); const idx = d.findIndex(x => x.id === id); if (idx >= 0) { d[idx] = { ...d[idx], ...i }; set(KEYS.IURAN, d); } },
  deleteIuran: (id: string) => { const d = get<IuranRecord>(KEYS.IURAN, defaultIuran).filter(x => x.id !== id); set(KEYS.IURAN, d); },

  // RESET
  resetAll: () => {
    set(KEYS.USERS, defaultUsers);
    set(KEYS.SANTRI, defaultSantri);
    set(KEYS.HAFALAN, defaultHafalan);
    set(KEYS.KEHADIRAN, defaultKehadiran);
    set(KEYS.IURAN, defaultIuran);
  }
};

// Helper
export const getSantriName = (id: string): string => {
  const santri = get<Santri>(KEYS.SANTRI, defaultSantri).find(s => s.id === id);
  return santri?.nama || 'Unknown';
};

export const getUsia = (tanggalLahir: string): number => {
  const today = new Date();
  const birth = new Date(tanggalLahir);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};
