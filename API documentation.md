
# 📘 API Dokumentasi — Sistem Perencanaan & Indikator

Base URL:
```
http://localhost:3000/api/
```

---

## 🔷 PERENCANAAN

### ✅ GET `/perencanaan`
Ambil semua perencanaan beserta daftar indikatornya (`populate` otomatis).

#### Response:
```json
[
  {
    "_id": "664...",
    "nama_program": "Program Pembangunan A",
    "opd_pelaksana": "Dinas PU",
    "tgl_mulai": "2025-06-01T00:00:00.000Z",
    "target": "100% selesai",
    "indikators": [
      {
        "_id": "664...",
        "indikator_label": "Survey awal",
        ...
      }
    ]
  }
]
```

---

### ✅ GET `/perencanaan/:id`
Ambil satu perencanaan beserta semua indikatornya.

**Params:**
- `id`: ID perencanaan (string)

---

### ✅ POST `/perencanaan`
Buat perencanaan **beserta daftar label indikator awalnya**.

#### Request Body:
```json
{
  "nama_program": "Program Irigasi",
  "opd_pelaksana": "Dinas Pertanian",
  "tgl_mulai": "2025-07-01",
  "target": "Selesai Q3",
  "indikator_labels": [
    "Survey awal",
    "Koordinasi warga",
    "Pembangunan saluran"
  ]
}
```

---

### ✅ PUT `/perencanaan/:id`
Update field perencanaan.

#### Request Body:
```json
{
  "target": "Selesai dalam 3 bulan"
}
```

---

### ✅ DELETE `/perencanaan/:id`
Hapus perencanaan.

---

## 🟩 INDIKATOR

### ✅ GET `/indikator`
Ambil semua indikator dari seluruh perencanaan.

---

### ✅ GET `/indikator/:id`
Ambil satu indikator berdasarkan ID.

---

### ✅ POST `/indikator`
Tambah satu indikator baru untuk perencanaan tertentu.

#### Request Body:
```json
{
  "indikator_label": "Laporan akhir",
  "id_perencanaan": "664..."
}
```

---

### ✅ PUT `/indikator/:id`
Update satu indikator (misalnya saat mengisi detail di halaman perencanaan).

#### Request Body:
```json
{
  "sudah_selesai": true,
  "kendala": "Hujan deras",
  "kesimpulan_tindakan": "Perlu dijadwal ulang",
  "evidence": [
    "public/664.../664.../evidence-123456.jpg"
  ]
}
```

---

### ✅ DELETE `/indikator/:id`
Hapus indikator dan otomatis hapus dari daftar di perencanaannya.

---

### 📤 POST `/indikator/:id/upload-evidence`
Upload satu atau lebih foto evidence untuk indikator tertentu.

#### Form-Data Fields:

| Field            | Type           | Required | Description                              |
|------------------|----------------|----------|------------------------------------------|
| `evidence`       | File (multiple)| ✅        | Foto-foto yang akan di-upload            |
| `id_perencanaan` | String         | ✅        | ID parent perencanaan                    |

#### Contoh:
- Endpoint: `/api/indikator/664.../upload-evidence`
- Form-data:
  - `id_perencanaan`: `664abc...`
  - `evidence`: (upload 1–10 files)

#### Disimpan di path:
```
public/[id_perencanaan]/[id_indikator]/evidence-<timestamp>.jpg
```

---

## ⚠️ CATATAN PENTING

- Semua ID adalah MongoDB ObjectId (string).
- Format tanggal: `YYYY-MM-DD`
- Upload foto menggunakan `multipart/form-data`
- Semua file evidence disimpan lokal di:
  ```
  public/[id_perencanaan]/[id_indikator]/
  ```



# 📘 API Dokumentasi — Evidence Upload & Delete

## 🔗 Base URL

```
http://localhost:3000/api/
```

---

## 🟩 INDIKATOR

### 📤 Upload Evidence

**Endpoint**  
```
POST /indikator/:id/upload-evidence
```

Unggah satu atau lebih file evidence untuk indikator tertentu.

**Form-Data Parameters**

| Field            | Type             | Required | Description                            |
|------------------|------------------|----------|----------------------------------------|
| `evidence`       | File (multiple)  | ✅        | File yang ingin di-upload              |
| `id_perencanaan` | String           | ✅        | ID dari perencanaan induk              |

**Contoh Request**  
- Endpoint: `/api/indikator/664abc123/upload-evidence`
- Form-Data:
  - `evidence`: (upload 1–10 files)
  - `id_perencanaan`: `664abc123`

**File Storage Path**
```
public/evidence/indikator/<id_perencanaan>/<id_indikator>/evidence-<timestamp>.jpg
```

**Contoh Response**
```json
{
  "_id": "664...",
  "evidence": [
    "http://localhost:3000/public/evidence/indikator/664abc/664xyz/evidence-1715232300100.jpg"
  ]
}
```

---

### 🗑️ Delete Evidence

**Endpoint**  
```
DELETE /indikator/:id/remove-evidence
```

Menghapus salah satu evidence dari database dan file system.

**Request Body**
```json
{
  "url": "http://localhost:3000/public/evidence/indikator/664abc/664xyz/evidence-1715232300100.jpg"
}
```

**Contoh Response**
```json
{
  "_id": "664...",
  "evidence": [
    // array evidence terbaru setelah penghapusan
  ]
}
```

---

## 🟦 AMPLIFIKASI

### 📤 Upload Evidence

**Endpoint**  
```
POST /amplifikasi/:id/upload-evidence
```

Unggah file evidence untuk konten amplifikasi.

**Form-Data Parameters**

| Field      | Type             | Required | Description                            |
|------------|------------------|----------|----------------------------------------|
| `evidence` | File (multiple)  | ✅        | File yang ingin di-upload              |

**File Storage Path**
```
public/evidence/amplifikasi/<id_amplifikasi>/evidence-<timestamp>.jpg
```

**Contoh Response**
```json
{
  "_id": "664...",
  "evidence": [
    "http://localhost:3000/public/evidence/amplifikasi/664xyz/evidence-1715232300100.jpg"
  ]
}
```

---

### 🗑️ Delete Evidence

**Endpoint**  
```
DELETE /amplifikasi/:id/remove-evidence
```

Menghapus satu evidence file dari amplifikasi.

**Request Body**
```json
{
  "url": "http://localhost:3000/public/evidence/amplifikasi/664xyz/evidence-1715232300100.jpg"
}
```

**Contoh Response**
```json
{
  "_id": "664...",
  "evidence": [
    // array evidence terbaru setelah penghapusan
  ]
}
```

---

## ⚙️ Catatan Teknis

- Semua file disimpan di folder lokal `public/evidence/`
- File disusun berdasarkan struktur per-model:
  - `public/evidence/indikator/<id_perencanaan>/<id_indikator>/`
  - `public/evidence/amplifikasi/<id_amplifikasi>/`
- Response dari upload memberikan full URL untuk digunakan langsung di frontend.
- Endpoint `DELETE` menggunakan `req.body` JSON untuk mengirim URL evidence yang ingin dihapus.
- Validasi dilakukan secara internal:
  - Tidak bisa upload jika `evidence` kosong.
  - Tidak bisa delete jika `url` tidak dikirim.

---

## 🔒 Keamanan

- Jika nanti ingin membatasi akses upload/hapus, bisa ditambahkan middleware autentikasi (misalnya JWT).
- Untuk file public, pastikan hanya menyajikan folder `public` secara aman:
```ts
app.use('/public', express.static('public'));
```

---

## 📦 Tips Integrasi Frontend

- Gunakan `FormData` untuk upload evidence:
```js
const form = new FormData();
form.append('evidence', file);
form.append('id_perencanaan', perencanaanId);
```

- Untuk delete:
```js
fetch(`/api/indikator/${id}/remove-evidence`, {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url })
});
```

---

## ✅ Status: Stable
Dokumentasi ini cocok untuk backend yang menggunakan Express + Multer + Mongoose + TypeScript.
