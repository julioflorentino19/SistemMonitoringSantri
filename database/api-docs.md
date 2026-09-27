# API Documentation - Sistem Informasi Data Santri
## Masjid Nurul Iman

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Semua endpoint memerlukan header Authorization:
```
Authorization: Bearer <token>
```

---

## 1. AUTHENTICATION

### POST /auth/login
Login ke sistem

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "nama_lengkap": "Ahmad Syaiful",
      "role": "admin"
    }
  }
}
```

### POST /auth/logout
Logout dari sistem

---

## 2. SANTRI

### GET /santri
Mendapatkan daftar semua santri

**Query Parameters:**
- `page` (int): Nomor halaman (default: 1)
- `limit` (int): Jumlah data per halaman (default: 10)
- `search` (string): Pencarian berdasarkan nama/NIS
- `kelas` (string): Filter berdasarkan kelas
- `status` (string): Filter berdasarkan status (aktif/alumni/nonaktif)

**Response:**
```json
{
  "success": true,
  "data": {
    "santri": [...],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

### GET /santri/:id
Mendapatkan detail santri

### POST /santri
Menambahkan santri baru

**Request Body:**
```json
{
  "nis": "2023013",
  "nama_lengkap": "Nama Lengkap",
  "nama_panggilan": "Panggilan",
  "jenis_kelamin": "L",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "2012-03-15",
  "alamat": "Jl. Contoh No. 1",
  "kelurahan": "Sukamaju",
  "kecamatan": "Cimanggis",
  "kota": "Depok",
  "no_hp_wali": "081234567890",
  "nama_wali": "Nama Wali",
  "kelas": "Kelas 1"
}
```

### PUT /santri/:id
Mengupdate data santri

### DELETE /santri/:id
Menghapus data santri

---

## 3. HAFALAN

### GET /hafalan
Mendapatkan daftar hafalan

**Query Parameters:**
- `santri_id` (int): Filter berdasarkan santri
- `tanggal` (date): Filter berdasarkan tanggal
- `status` (string): Filter berdasarkan status
- `bulan` (int): Filter bulan (1-12)
- `tahun` (int): Filter tahun

### GET /hafalan/:id
Mendapatkan detail hafalan

### POST /hafalan
Mencatat hafalan baru

**Request Body:**
```json
{
  "santri_id": 1,
  "tanggal": "2024-01-15",
  "surat": "Al-Baqarah",
  "nomor_surat": 2,
  "ayat_mulai": 1,
  "ayat_selesai": 10,
  "juz": 1,
  "halaman": 2,
  "status": "lancar",
  "nilai": 90,
  "catatan": "Masya Allah, sangat lancar",
  "penguji": "Ustadz Ali"
}
```

### PUT /hafalan/:id
Mengupdate data hafalan

### DELETE /hafalan/:id
Menghapus data hafalan

---

## 4. KEHADIRAN

### GET /kehadiran
Mendapatkan daftar kehadiran

**Query Parameters:**
- `santri_id` (int): Filter berdasarkan santri
- `tanggal` (date): Filter berdasarkan tanggal
- `status` (string): Filter berdasarkan status
- `bulan` (int): Filter bulan
- `tahun` (int): Filter tahun

### GET /kehadiran/rekap
Mendapatkan rekap kehadiran

**Query Parameters:**
- `bulan` (int): Bulan
- `tahun` (int): Tahun

### POST /kehadiran
Mencatat kehadiran

**Request Body:**
```json
{
  "santri_id": 1,
  "tanggal": "2024-01-15",
  "status": "hadir",
  "keterangan": "Hadir tepat waktu",
  "jam_masuk": "15:30:00",
  "jam_keluar": "17:00:00"
}
```

### POST /kehadiran/bulk
Mencatat kehadiran massal

**Request Body:**
```json
{
  "tanggal": "2024-01-15",
  "data": [
    { "santri_id": 1, "status": "hadir" },
    { "santri_id": 2, "status": "izin", "keterangan": "Sakit" }
  ]
}
```

---

## 5. IURAN

### GET /iuran
Mendapatkan daftar iuran

**Query Parameters:**
- `santri_id` (int): Filter berdasarkan santri
- `bulan` (string): Filter bulan
- `tahun` (int): Filter tahun
- `status` (string): Filter status

### GET /iuran/rekap
Mendapatkan rekap iuran

**Query Parameters:**
- `bulan` (string): Bulan
- `tahun` (int): Tahun

### POST /iuran
Mencatat pembayaran iuran

**Request Body:**
```json
{
  "santri_id": 1,
  "bulan": "Januari",
  "tahun": 2024,
  "jumlah_tagihan": 50000,
  "jumlah_bayar": 50000,
  "metode_bayar": "tunai",
  "keterangan": "Pembayaran penuh"
}
```

---

## 6. LAPORAN

### GET /laporan/dashboard
Mendapatkan data dashboard

**Response:**
```json
{
  "success": true,
  "data": {
    "total_santri": 12,
    "total_hadir_hari_ini": 10,
    "total_hafalan_bulan_ini": 25,
    "total_iuran_terkumpul": 450000,
    "persentase_kehadiran": 83.3,
    "grafik_kehadiran": [...],
    "grafik_hafalan": [...]
  }
}
```

### GET /laporan/kehadiran
Laporan kehadiran bulanan

### GET /laporan/hafalan
Laporan progress hafalan

### GET /laporan/iuran
Laporan keuangan iuran

### GET /laporan/export/:jenis
Export laporan ke Excel/PDF

**Parameter jenis:**
- `kehadiran`
- `hafalan`
- `iuran`
- `santri`

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Invalid request",
    "details": "Field 'nama_lengkap' is required"
  }
}
```

## HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
