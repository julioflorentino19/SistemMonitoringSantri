// ============================================================
// DATABASE LAYER - LocalStorage dengan CRUD Operations
// ============================================================

export interface User {
  id: string;
  username: string;
  password: string;
  namaLengkap: string;
  email: string;
  role: 'admin' | 'pengurus' | 'ustadz';
}

export interface Santri {
  id: string;
  nis: string;
  nama: string;
  namaPanggilan: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  noHpWali: string;
  namaWali: string;
  kelas: string;
  tanggalDaftar: string;
  status: 'aktif' | 'alumni' | 'nonaktif';
}

export interface Hafalan {
  id: string;
  santriId: string;
  tanggal: string;
  surat: string;
  ayatMulai: number;
  ayatSelesai: number;
  juz: number;
  status: 'lancar' | 'kurang_lancar' | 'belum_lancar';
  nilai: number;
  catatan: string;
  penguji: string;
}

export interface Kehadiran {
  id: string;
  santriId: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan: string;
}

export interface Iuran {
  id: string;
  santriId: string;
  bulan: string;
  tahun: number;
  jumlahTagihan: number;
  jumlahBayar: number;
  status: 'lunas' | 'sebagian' | 'belum_bayar';
  tanggalBayar: string | null;
  metodeBayar: 'tunai' | 'transfer' | 'qris';
  keterangan: string;
}

const DB_KEYS = {
  USERS: 'db_users_v2',
  SANTRI: 'db_santri_v2',
  HAFALAN: 'db_hafalan_v2',
  KEHADIRAN: 'db_kehadiran_v2',
  IURAN: 'db_iuran_v2',
  SESSION: 'db_session_v2',
};

// Helper functions
const genId = (prefix: string) => `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 4)}`;
const read = <T>(key: string): T[] => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
const write = <T>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data));

// Default seed data
const seedUsers: User[] = [
  { id: 'U1', username: 'admin', password: 'admin123', namaLengkap: 'Ahmad Syaiful', email: 'admin@nuruliman.id', role: 'admin' },
  { id: 'U2', username: 'ustadz', password: 'ustadz123', namaLengkap: 'Ustadz Ali', email: 'ali@nuruliman.id', role: 'ustadz' },
  { id: 'U3', username: 'pengurus', password: 'pengurus123', namaLengkap: 'Budi Santoso', email: 'budi@nuruliman.id', role: 'pengurus' },
];

const seedSantri: Santri[] = [
  { id: 'S1', nis: '2023001', nama: 'Ahmad Fauzi Rahman', namaPanggilan: 'Fauzi', jenisKelamin: 'L', tempatLahir: 'Jakarta', tanggalLahir: '2012-03-15', alamat: 'Jl. Mawar No. 5', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567890', namaWali: 'H. Rahman', kelas: 'Kelas 1', tanggalDaftar: '2023-01-15', status: 'aktif' },
  { id: 'S2', nis: '2023002', nama: 'Siti Aisyah', namaPanggilan: 'Aisyah', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2014-07-22', alamat: 'Jl. Melati No. 12', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567891', namaWali: 'Hj. Fatimah', kelas: 'Kelas 1', tanggalDaftar: '2023-02-20', status: 'aktif' },
  { id: 'S3', nis: '2023003', nama: 'Muhammad Rizki', namaPanggilan: 'Rizki', jenisKelamin: 'L', tempatLahir: 'Bogor', tanggalLahir: '2010-11-08', alamat: 'Jl. Anggrek No. 8', kelurahan: 'Curug', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567892', namaWali: 'Ir. Aditya', kelas: 'Kelas 2', tanggalDaftar: '2023-01-10', status: 'aktif' },
  { id: 'S4', nis: '2023004', nama: 'Fatimah Zahra', namaPanggilan: 'Fatimah', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2013-05-30', alamat: 'Jl. Kenanga No. 3', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567893', namaWali: 'Drs. Salsabila', kelas: 'Kelas 1', tanggalDaftar: '2023-03-05', status: 'aktif' },
  { id: 'S5', nis: '2023005', nama: 'Abdullah Hakim', namaPanggilan: 'Abdullah', jenisKelamin: 'L', tempatLahir: 'Depok', tanggalLahir: '2011-09-14', alamat: 'Jl. Dahlia No. 15', kelurahan: 'Sukmajaya', kecamatan: 'Sukmajaya', kota: 'Depok', noHpWali: '081234567894', namaWali: 'H. Pratama', kelas: 'Kelas 2', tanggalDaftar: '2023-01-20', status: 'aktif' },
  { id: 'S6', nis: '2023006', nama: 'Khadijah Amina', namaPanggilan: 'Khadijah', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2014-01-25', alamat: 'Jl. Tulip No. 7', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567895', namaWali: 'Hj. Rahma', kelas: 'Kelas 1', tanggalDaftar: '2023-04-01', status: 'aktif' },
  { id: 'S7', nis: '2023007', nama: 'Umar Faruq', namaPanggilan: 'Umar', jenisKelamin: 'L', tempatLahir: 'Bogor', tanggalLahir: '2009-12-03', alamat: 'Jl. Sakura No. 9', kelurahan: 'Curug', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567896', namaWali: 'H. Nugroho', kelas: 'Kelas 3', tanggalDaftar: '2022-08-15', status: 'aktif' },
  { id: 'S8', nis: '2023008', nama: 'Maryam Shalihah', namaPanggilan: 'Maryam', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '2012-06-18', alamat: 'Jl. Kamboja No. 4', kelurahan: 'Sukamaju', kecamatan: 'Cimanggis', kota: 'Depok', noHpWali: '081234567897', namaWali: 'Hj. Dewi', kelas: 'Kelas 2', tanggalDaftar: '2023-02-10', status: 'aktif' },
];

const seedHafalan: Hafalan[] = [
  { id: 'H1', santriId: 'S1', tanggal: '2024-01-15', surat: 'Al-Baqarah', ayatMulai: 1, ayatSelesai: 10, juz: 1, status: 'lancar', nilai: 90, catatan: 'Masya Allah, sangat lancar', penguji: 'Ustadz Ali' },
  { id: 'H2', santriId: 'S1', tanggal: '2024-01-16', surat: 'Al-Baqarah', ayatMulai: 11, ayatSelesai: 20, juz: 1, status: 'kurang_lancar', nilai: 70, catatan: 'Perlu mengulang', penguji: 'Ustadz Ali' },
  { id: 'H3', santriId: 'S2', tanggal: '2024-01-15', surat: 'Al-Fatihah', ayatMulai: 1, ayatSelesai: 7, juz: 30, status: 'lancar', nilai: 95, catatan: 'Sangat baik', penguji: 'Ustadz Ali' },
  { id: 'H4', santriId: 'S3', tanggal: '2024-01-15', surat: 'Ali Imran', ayatMulai: 1, ayatSelesai: 15, juz: 3, status: 'kurang_lancar', nilai: 60, catatan: 'Perlu latihan tajwid', penguji: 'Ustadz Ali' },
  { id: 'H5', santriId: 'S4', tanggal: '2024-01-15', surat: 'An-Nisa', ayatMulai: 1, ayatSelesai: 10, juz: 4, status: 'belum_lancar', nilai: 45, catatan: 'Perlu bimbingan', penguji: 'Ustadz Ali' },
  { id: 'H6', santriId: 'S5', tanggal: '2024-01-15', surat: 'Al-Maidah', ayatMulai: 1, ayatSelesai: 12, juz: 6, status: 'lancar', nilai: 92, catatan: 'Hafalan kuat', penguji: 'Ustadz Ali' },
  { id: 'H7', santriId: 'S6', tanggal: '2024-01-15', surat: 'An-Nas', ayatMulai: 1, ayatSelesai: 6, juz: 30, status: 'lancar', nilai: 98, catatan: 'Sempurna', penguji: 'Ustadz Ali' },
  { id: 'H8', santriId: 'S7', tanggal: '2024-01-15', surat: 'Yasin', ayatMulai: 1, ayatSelesai: 20, juz: 22, status: 'lancar', nilai: 88, catatan: 'Konsisten', penguji: 'Ustadz Ali' },
];

const seedKehadiran: Kehadiran[] = [
  { id: 'K1', santriId: 'S1', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K2', santriId: 'S2', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K3', santriId: 'S3', tanggal: '2024-01-15', status: 'sakit', keterangan: 'Demam' },
  { id: 'K4', santriId: 'S4', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K5', santriId: 'S5', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K6', santriId: 'S6', tanggal: '2024-01-15', status: 'izin', keterangan: 'Acara keluarga' },
  { id: 'K7', santriId: 'S7', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K8', santriId: 'S8', tanggal: '2024-01-15', status: 'alpha', keterangan: '' },
  { id: 'K9', santriId: 'S1', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K10', santriId: 'S2', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K11', santriId: 'S3', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K12', santriId: 'S4', tanggal: '2024-01-16', status: 'sakit', keterangan: 'Flu' },
];

const seedIuran: Iuran[] = [
  { id: 'I1', santriId: 'S1', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-05', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I2', santriId: 'S2', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-03', metodeBayar: 'transfer', keterangan: 'BCA' },
  { id: 'I3', santriId: 'S3', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 30000, status: 'sebagian', tanggalBayar: '2024-01-10', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I4', santriId: 'S4', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-07', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I5', santriId: 'S5', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 0, status: 'belum_bayar', tanggalBayar: null, metodeBayar: 'tunai', keterangan: '' },
  { id: 'I6', santriId: 'S6', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-02', metodeBayar: 'qris', keterangan: '' },
  { id: 'I7', santriId: 'S7', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 50000, status: 'lunas', tanggalBayar: '2024-01-04', metodeBayar: 'tunai', keterangan: '' },
  { id: 'I8', santriId: 'S8', bulan: 'Januari', tahun: 2024, jumlahTagihan: 50000, jumlahBayar: 25000, status: 'sebagian', tanggalBayar: '2024-01-12', metodeBayar: 'tunai', keterangan: '' },
];

// Initialize database
export function initDB() {
  if (read(DB_KEYS.USERS).length === 0) write(DB_KEYS.USERS, seedUsers);
  if (read(DB_KEYS.SANTRI).length === 0) write(DB_KEYS.SANTRI, seedSantri);
  if (read(DB_KEYS.HAFALAN).length === 0) write(DB_KEYS.HAFALAN, seedHafalan);
  if (read(DB_KEYS.KEHADIRAN).length === 0) write(DB_KEYS.KEHADIRAN, seedKehadiran);
  if (read(DB_KEYS.IURAN).length === 0) write(DB_KEYS.IURAN, seedIuran);
}

// Reset database
export function resetDB() {
  write(DB_KEYS.USERS, seedUsers);
  write(DB_KEYS.SANTRI, seedSantri);
  write(DB_KEYS.HAFALAN, seedHafalan);
  write(DB_KEYS.KEHADIRAN, seedKehadiran);
  write(DB_KEYS.IURAN, seedIuran);
  localStorage.removeItem(DB_KEYS.SESSION);
}

// Auth
export const auth = {
  login: (username: string, password: string): User | null => {
    const users = read<User>(DB_KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) { localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user)); return user; }
    return null;
  },
  logout: () => localStorage.removeItem(DB_KEYS.SESSION),
  getSession: (): User | null => {
    try { return JSON.parse(localStorage.getItem(DB_KEYS.SESSION) || 'null'); }
    catch { return null; }
  },
};

// CRUD Operations
export const db = {
  // Users
  getUsers: () => read<User>(DB_KEYS.USERS),
  addUser: (u: Omit<User, 'id'>): User => {
    const users = read<User>(DB_KEYS.USERS);
    const newUser = { ...u, id: genId('U') };
    users.push(newUser);
    write(DB_KEYS.USERS, users);
    return newUser;
  },
  updateUser: (id: string, data: Partial<User>) => {
    const users = read<User>(DB_KEYS.USERS);
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { users[idx] = { ...users[idx], ...data }; write(DB_KEYS.USERS, users); }
  },
  deleteUser: (id: string) => {
    const users = read<User>(DB_KEYS.USERS).filter(u => u.id !== id);
    write(DB_KEYS.USERS, users);
  },

  // Santri
  getSantri: () => read<Santri>(DB_KEYS.SANTRI),
  addSantri: (s: Omit<Santri, 'id'>): Santri => {
    const data = read<Santri>(DB_KEYS.SANTRI);
    const newS = { ...s, id: genId('S') };
    data.push(newS);
    write(DB_KEYS.SANTRI, data);
    return newS;
  },
  updateSantri: (id: string, data: Partial<Santri>) => {
    const items = read<Santri>(DB_KEYS.SANTRI);
    const idx = items.findIndex(s => s.id === id);
    if (idx >= 0) { items[idx] = { ...items[idx], ...data }; write(DB_KEYS.SANTRI, items); }
  },
  deleteSantri: (id: string) => {
    const data = read<Santri>(DB_KEYS.SANTRI).filter(s => s.id !== id);
    write(DB_KEYS.SANTRI, data);
  },

  // Hafalan
  getHafalan: () => read<Hafalan>(DB_KEYS.HAFALAN),
  addHafalan: (h: Omit<Hafalan, 'id'>): Hafalan => {
    const data = read<Hafalan>(DB_KEYS.HAFALAN);
    const newH = { ...h, id: genId('H') };
    data.push(newH);
    write(DB_KEYS.HAFALAN, data);
    return newH;
  },
  updateHafalan: (id: string, data: Partial<Hafalan>) => {
    const items = read<Hafalan>(DB_KEYS.HAFALAN);
    const idx = items.findIndex(h => h.id === id);
    if (idx >= 0) { items[idx] = { ...items[idx], ...data }; write(DB_KEYS.HAFALAN, items); }
  },
  deleteHafalan: (id: string) => {
    const data = read<Hafalan>(DB_KEYS.HAFALAN).filter(h => h.id !== id);
    write(DB_KEYS.HAFALAN, data);
  },

  // Kehadiran
  getKehadiran: () => read<Kehadiran>(DB_KEYS.KEHADIRAN),
  addKehadiran: (k: Omit<Kehadiran, 'id'>): Kehadiran => {
    const data = read<Kehadiran>(DB_KEYS.KEHADIRAN);
    const newK = { ...k, id: genId('K') };
    data.push(newK);
    write(DB_KEYS.KEHADIRAN, data);
    return newK;
  },
  updateKehadiran: (id: string, data: Partial<Kehadiran>) => {
    const items = read<Kehadiran>(DB_KEYS.KEHADIRAN);
    const idx = items.findIndex(k => k.id === id);
    if (idx >= 0) { items[idx] = { ...items[idx], ...data }; write(DB_KEYS.KEHADIRAN, items); }
  },
  deleteKehadiran: (id: string) => {
    const data = read<Kehadiran>(DB_KEYS.KEHADIRAN).filter(k => k.id !== id);
    write(DB_KEYS.KEHADIRAN, data);
  },

  // Iuran
  getIuran: () => read<Iuran>(DB_KEYS.IURAN),
  addIuran: (i: Omit<Iuran, 'id'>): Iuran => {
    const data = read<Iuran>(DB_KEYS.IURAN);
    const newI = { ...i, id: genId('I') };
    data.push(newI);
    write(DB_KEYS.IURAN, data);
    return newI;
  },
  updateIuran: (id: string, data: Partial<Iuran>) => {
    const items = read<Iuran>(DB_KEYS.IURAN);
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) { items[idx] = { ...items[idx], ...data }; write(DB_KEYS.IURAN, items); }
  },
  deleteIuran: (id: string) => {
    const data = read<Iuran>(DB_KEYS.IURAN).filter(i => i.id !== id);
    write(DB_KEYS.IURAN, data);
  },
};

// Helpers
export const getSantriName = (id: string): string => {
  const s = read<Santri>(DB_KEYS.SANTRI).find(s => s.id === id);
  return s?.nama || 'Unknown';
};

export const getUsia = (tgl: string): number => {
  const today = new Date();
  const birth = new Date(tgl);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export type Page = 'dashboard' | 'santri' | 'hafalan' | 'kehadiran' | 'iuran' | 'laporan';
