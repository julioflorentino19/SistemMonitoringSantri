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

export interface HafalanRecord {
  id: string;
  santriId: string;
  tanggal: string;
  surat: string;
  nomorSurat: number;
  ayatMulai: number;
  ayatSelesai: number;
  juz: number;
  halaman: number;
  status: 'lancar' | 'kurang_lancar' | 'belum_lancar';
  nilai: number;
  catatan: string;
  penguji: string;
}

export interface KehadiranRecord {
  id: string;
  santriId: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan: string;
  jamMasuk: string | null;
  jamKeluar: string | null;
}

export interface IuranRecord {
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

export interface User {
  id: string;
  username: string;
  namaLengkap: string;
  email: string;
  role: 'admin' | 'pengurus' | 'ustadz';
}

export type Page = 'dashboard' | 'santri' | 'hafalan' | 'kehadiran' | 'iuran' | 'laporan';
