import { Santri, HafalanRecord, KehadiranRecord, IuranRecord } from './types';

export const santriData: Santri[] = [
  { id: 'S001', nama: 'Ahmad Fauzi', usia: 12, kelas: 'Kelas 1', alamat: 'Jl. Mawar No. 5', noHp: '081234567890', foto: '', tanggalDaftar: '2023-01-15' },
  { id: 'S002', nama: 'Siti Aisyah', usia: 10, kelas: 'Kelas 1', alamat: 'Jl. Melati No. 12', noHp: '081234567891', foto: '', tanggalDaftar: '2023-02-20' },
  { id: 'S003', nama: 'Muhammad Rizki', usia: 14, kelas: 'Kelas 2', alamat: 'Jl. Anggrek No. 8', noHp: '081234567892', foto: '', tanggalDaftar: '2023-01-10' },
  { id: 'S004', nama: 'Fatimah Zahra', usia: 11, kelas: 'Kelas 1', alamat: 'Jl. Kenanga No. 3', noHp: '081234567893', foto: '', tanggalDaftar: '2023-03-05' },
  { id: 'S005', nama: 'Abdullah Hakim', usia: 13, kelas: 'Kelas 2', alamat: 'Jl. Dahlia No. 15', noHp: '081234567894', foto: '', tanggalDaftar: '2023-01-20' },
  { id: 'S006', nama: 'Khadijah Amina', usia: 10, kelas: 'Kelas 1', alamat: 'Jl. Tulip No. 7', noHp: '081234567895', foto: '', tanggalDaftar: '2023-04-01' },
  { id: 'S007', nama: 'Umar Faruq', usia: 15, kelas: 'Kelas 3', alamat: 'Jl. Sakura No. 9', noHp: '081234567896', foto: '', tanggalDaftar: '2022-08-15' },
  { id: 'S008', nama: 'Maryam Shalihah', usia: 12, kelas: 'Kelas 2', alamat: 'Jl. Kamboja No. 4', noHp: '081234567897', foto: '', tanggalDaftar: '2023-02-10' },
  { id: 'S009', nama: 'Ibrahim Adha', usia: 14, kelas: 'Kelas 2', alamat: 'Jl. Cempaka No. 11', noHp: '081234567898', foto: '', tanggalDaftar: '2023-01-25' },
  { id: 'S010', nama: 'Aisyah Putri', usia: 11, kelas: 'Kelas 1', alamat: 'Jl. Flamboyan No. 6', noHp: '081234567899', foto: '', tanggalDaftar: '2023-05-01' },
];

export const hafalanData: HafalanRecord[] = [
  { id: 'H001', santriId: 'S001', tanggal: '2024-01-15', surat: 'Al-Baqarah', ayat: '1-10', juz: 1, status: 'lancar', catatan: 'Masya Allah, sangat lancar' },
  { id: 'H002', santriId: 'S001', tanggal: '2024-01-16', surat: 'Al-Baqarah', ayat: '11-20', juz: 1, status: 'kurang_lancar', catatan: 'Perlu mengulang ayat 15-17' },
  { id: 'H003', santriId: 'S002', tanggal: '2024-01-15', surat: 'Al-Fatihah', ayat: '1-7', juz: 30, status: 'lancar', catatan: 'Sudah sangat baik' },
  { id: 'H004', santriId: 'S002', tanggal: '2024-01-16', surat: 'Al-Baqarah', ayat: '1-5', juz: 1, status: 'lancar', catatan: 'Bagus, terus tingkatkan' },
  { id: 'H005', santriId: 'S003', tanggal: '2024-01-15', surat: 'Ali Imran', ayat: '1-15', juz: 3, status: 'kurang_lancar', catatan: 'Masih perlu latihan tajwid' },
  { id: 'H006', santriId: 'S003', tanggal: '2024-01-16', surat: 'Ali Imran', ayat: '16-30', juz: 3, status: 'lancar', catatan: 'Perkembangan baik' },
  { id: 'H007', santriId: 'S004', tanggal: '2024-01-15', surat: 'An-Nisa', ayat: '1-10', juz: 4, status: 'belum_lancar', catatan: 'Perlu bimbingan lebih' },
  { id: 'H008', santriId: 'S005', tanggal: '2024-01-15', surat: 'Al-Maidah', ayat: '1-12', juz: 6, status: 'lancar', catatan: 'Hafalan sangat kuat' },
  { id: 'H009', santriId: 'S006', tanggal: '2024-01-15', surat: 'An-Nas', ayat: '1-6', juz: 30, status: 'lancar', catatan: 'Sudah sempurna' },
  { id: 'H010', santriId: 'S007', tanggal: '2024-01-15', surat: 'Yasin', ayat: '1-20', juz: 22, status: 'lancar', catatan: 'Masya Allah, konsisten' },
  { id: 'H011', santriId: 'S008', tanggal: '2024-01-16', surat: 'Al-Kahfi', ayat: '1-10', juz: 15, status: 'kurang_lancar', catatan: 'Perlu mengulang' },
  { id: 'H012', santriId: 'S009', tanggal: '2024-01-16', surat: 'Ar-Rahman', ayat: '1-15', juz: 27, status: 'lancar', catatan: 'Tajwid sudah baik' },
  { id: 'H013', santriId: 'S010', tanggal: '2024-01-16', surat: 'Al-Mulk', ayat: '1-10', juz: 29, status: 'kurang_lancar', catatan: 'Masih menghafal' },
];

export const kehadiranData: KehadiranRecord[] = [
  { id: 'K001', santriId: 'S001', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K002', santriId: 'S002', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K003', santriId: 'S003', tanggal: '2024-01-15', status: 'sakit', keterangan: 'Demam' },
  { id: 'K004', santriId: 'S004', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K005', santriId: 'S005', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K006', santriId: 'S006', tanggal: '2024-01-15', status: 'izin', keterangan: 'Acara keluarga' },
  { id: 'K007', santriId: 'S007', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K008', santriId: 'S008', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K009', santriId: 'S009', tanggal: '2024-01-15', status: 'alpha', keterangan: '' },
  { id: 'K010', santriId: 'S010', tanggal: '2024-01-15', status: 'hadir', keterangan: '' },
  { id: 'K011', santriId: 'S001', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K012', santriId: 'S002', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K013', santriId: 'S003', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K014', santriId: 'S004', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K015', santriId: 'S005', tanggal: '2024-01-16', status: 'sakit', keterangan: 'Flu' },
  { id: 'K016', santriId: 'S006', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K017', santriId: 'S007', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K018', santriId: 'S008', tanggal: '2024-01-16', status: 'izin', keterangan: 'Kontrol dokter' },
  { id: 'K019', santriId: 'S009', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
  { id: 'K020', santriId: 'S010', tanggal: '2024-01-16', status: 'hadir', keterangan: '' },
];

export const iuranData: IuranRecord[] = [
  { id: 'I001', santriId: 'S001', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'lunas', tanggalBayar: '2024-01-05' },
  { id: 'I002', santriId: 'S002', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'lunas', tanggalBayar: '2024-01-03' },
  { id: 'I003', santriId: 'S003', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'sebagian', tanggalBayar: '2024-01-10' },
  { id: 'I004', santriId: 'S004', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'lunas', tanggalBayar: '2024-01-07' },
  { id: 'I005', santriId: 'S005', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'belum_bayar', tanggalBayar: null },
  { id: 'I006', santriId: 'S006', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'lunas', tanggalBayar: '2024-01-02' },
  { id: 'I007', santriId: 'S007', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'lunas', tanggalBayar: '2024-01-04' },
  { id: 'I008', santriId: 'S008', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'sebagian', tanggalBayar: '2024-01-12' },
  { id: 'I009', santriId: 'S009', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'belum_bayar', tanggalBayar: null },
  { id: 'I010', santriId: 'S010', bulan: 'Januari', tahun: 2024, jumlah: 50000, status: 'lunas', tanggalBayar: '2024-01-06' },
];

export const getSantriById = (id: string): Santri | undefined => {
  return santriData.find(s => s.id === id);
};

export const getSantriName = (id: string): string => {
  const santri = getSantriById(id);
  return santri ? santri.nama : 'Unknown';
};
