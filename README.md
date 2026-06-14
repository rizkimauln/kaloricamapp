# CaloriCam 📸🥗

CaloriCam adalah aplikasi cerdas berbasis *Artificial Intelligence* (AI) yang dapat mengklasifikasikan gambar makanan dan mengestimasi jumlah kalorinya secara *real-time*. Proyek ini dibangun dengan arsitektur *microservices*, memisahkan *Frontend*, *Backend*, dan *AI Service* untuk kinerja dan skalabilitas yang maksimal.

---

## 🌟 Fitur Utama
- **Pemindai Makanan (Food Scanner)**: Deteksi jenis makanan dari foto menggunakan model *Deep Learning* (EfficientNet).
- **Estimasi Kalori Akurat**: Secara otomatis menghitung estimasi kalori berdasarkan makanan yang terdeteksi.
- **Riwayat Konsumsi**: Lacak jejak dan asupan kalori harian/mingguan Anda.
- **Eksplorasi Makanan**: Cari dan temukan direktori berbagai jenis makanan lengkap dengan informasi kalori per porsi.
- **Profil Pengguna**: Manajemen akun dan kustomisasi foto profil pengguna.
- **Tampilan Modern**: UI/UX yang responsif, minimalis, dan elegan.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibagi menjadi tiga layanan utama:

1. **Frontend**: React.js + Vite (JavaScript)
2. **Backend**: Laravel 11 (PHP) + MySQL
3. **AI Service**: FastAPI (Python) + TensorFlow/Keras
4. **Machine Learning**: Jupyter Notebook (Untuk *training* model)

---

## 📂 Struktur Proyek

```text
Caloricam/
├── AI Service/       # Layanan API berbasis Python untuk memproses deteksi gambar
├── Backend/          # Layanan API berbasis PHP/Laravel untuk manajemen user & database
├── Frontend/         # Layanan UI/UX berbasis React.js
└── Model/            # Jupyter notebook, file model (.keras), dan kamus kalori (.json)
```

---

## 🚀 Instalasi & Persiapan (*Setup*)

Sebelum menjalankan proyek, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (v18+)
- [PHP](https://www.php.net/) (v8.2+) & [Composer](https://getcomposer.org/)
- [Python](https://www.python.org/) (v3.10+)
- Database MySQL (misal: XAMPP / Laragon / Hostinger)

### 1. Persiapan Backend (Laravel)
```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
```
- Buka file `.env` di folder `Backend` dan sesuaikan kredensial koneksi MySQL Anda.
- Jalankan migrasi database untuk membuat tabel `users` dan `scans`:
```bash
php artisan migrate
```
- Jalankan server backend:
```bash
php artisan serve --port=8001
```

### 2. Persiapan AI Service (FastAPI)
```bash
cd "AI Service"
# Disarankan membuat Virtual Environment
python -m venv venv
# Aktifkan venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)

pip install -r requirements.txt
```
- Jalankan server AI Service:
```bash
uvicorn main:app --port 8000 --reload
```

### 3. Persiapan Frontend (React/Vite)
```bash
cd Frontend
npm install
cp .env.example .env
```
- Pastikan isi `.env` sudah mengarah ke port Backend (8001) dan AI Service (8000).
- Jalankan server frontend:
```bash
npm run dev
```

Aplikasi sekarang dapat diakses melalui browser di `http://localhost:5173`.

---

## 📊 Dataset Makanan

Model AI di dalam aplikasi ini dilatih menggunakan dataset gambar makanan khusus. Karena ukurannya yang besar, dataset **tidak disertakan** di dalam repositori Github ini. 

Anda dapat mengunduh dataset secara manual melalui tautan berikut:
🔗 **[Unduh Dataset CaloriCam (Klik Disini) - URL DUMMY]** *(https://example-dummy-url.com/download/dataset_makanan.zip)*

**Cara Menggunakan Dataset:**
1. Ekstrak file `.zip` yang telah diunduh.
2. Pindahkan folder hasil ekstraksi ke dalam direktori `Model/`.
3. Buka file `Model/food_calorie_classification.ipynb` menggunakan Jupyter Notebook.
4. Sesuaikan variabel path direktori pada sel *Import Dataset*, lalu jalankan ulang seluruh *cell* (Run All) untuk melatih ulang (*retrain*) model AI Anda.

---

## 📸 Tangkapan Layar (Screenshots)

*(Tambahkan gambar screenshot aplikasi Anda di sini nanti)*
- `![Home Page](/path/to/home.png)`
- `![Scanner](/path/to/scan.png)`
- `![Profile](/path/to/profile.png)`

---

## 📄 Lisensi
Proyek ini dibuat untuk tujuan edukasi dan portofolio. Bebas digunakan dan dikembangkan lebih lanjut.
