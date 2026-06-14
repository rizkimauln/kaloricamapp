# CaloriCam

CaloriCam adalah aplikasi cerdas berbasis Artificial Intelligence (AI) yang dapat mengklasifikasikan gambar makanan dan mengestimasi jumlah kalorinya secara real-time. Proyek ini dibangun dengan arsitektur microservices, memisahkan Frontend, Backend, dan AI Service untuk kinerja dan skalabilitas yang maksimal.

---

## Fitur Utama
- Pemindai Makanan (Food Scanner): Deteksi jenis makanan dari foto menggunakan model Deep Learning.
- Estimasi Kalori Akurat: Secara otomatis menghitung estimasi kalori berdasarkan makanan yang terdeteksi.
- Riwayat Konsumsi: Lacak jejak dan asupan kalori harian/mingguan Anda.
- Eksplorasi Makanan: Cari dan temukan direktori berbagai jenis makanan lengkap dengan informasi kalori per porsi.
- Profil Pengguna: Manajemen akun dan kustomisasi foto profil pengguna.
- Tampilan Modern: UI/UX yang responsif, minimalis, dan elegan.

---

## Teknologi yang Digunakan

Proyek ini dibagi menjadi tiga layanan utama dan satu bagian pengembangan mesin pemelajaran:

1. Frontend: React.js + Vite (JavaScript)
2. Backend: Laravel 11 (PHP) + MySQL
3. AI Service: FastAPI (Python) + TensorFlow/Keras
4. Model & Algoritma: Menggunakan algoritma Convolutional Neural Network (CNN) dengan arsitektur EfficientNet. Proses pelatihan dilakukan di Jupyter Notebook.

---

## Struktur Proyek

```text
Caloricam/
├── AI Service/       # Layanan API berbasis Python untuk memproses deteksi gambar
├── Backend/          # Layanan API berbasis PHP/Laravel untuk manajemen user & database
├── Frontend/         # Layanan UI/UX berbasis React.js
└── Model/            # Jupyter notebook, file model (.keras), dan kamus kalori (.json)
```

---

## Instalasi & Persiapan (Setup)

Sebelum menjalankan proyek, pastikan Anda telah menginstal Node.js (v18+), PHP (v8.2+) & Composer, Python (v3.10+), serta Database MySQL (XAMPP / Laragon / Hostinger).

### 1. Persiapan Backend (Laravel)
```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
```
Buka file `.env` di folder `Backend` dan sesuaikan kredensial koneksi MySQL Anda. Contoh konfigurasi `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kaloricam
DB_USERNAME=root
DB_PASSWORD=
```
Jalankan migrasi database untuk membuat tabel:
```bash
php artisan migrate
```
Jalankan server backend:
```bash
php artisan serve --port=8001
```

### 2. Persiapan AI Service (FastAPI)
```bash
cd "AI Service"
python -m venv venv
# Aktifkan venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Jalankan server AI Service:
```bash
uvicorn main:app --port 8000 --reload
```

### 3. Persiapan Frontend (React/Vite)
```bash
cd Frontend
npm install
cp .env.example .env
```
Buka file `.env` di folder `Frontend` dan pastikan URL mengarah ke port Backend dan AI Service yang benar. Contoh konfigurasi `.env`:
```env
VITE_API_URL=http://localhost:8001/api
VITE_AI_SERVICE_URL=http://localhost:8000
```
Jalankan server frontend:
```bash
npm run dev
```

Aplikasi sekarang dapat diakses melalui browser di `http://localhost:5173`.

---

## Manajemen Model & Dataset

Model AI dilatih menggunakan dataset gambar makanan khusus. Karena ukurannya yang sangat besar, dataset tidak disertakan di dalam repositori Github ini. 

Anda dapat mengunduh dataset secara manual melalui tautan berikut:
[Unduh Dataset CaloriCam (Klik Disini) - URL DUMMY](https://example-dummy-url.com/download/dataset_makanan.zip)

### Struktur File di Folder Model
```text
Model/
├── Dataset/                           # Folder ekstraksi dari file ZIP dataset (Tidak masuk GitHub)
│   ├── Anggur/                        # Subfolder nama kelas makanan (berisi foto-foto)
│   ├── Apel/                          
│   └── Ayam Goreng/                   
├── best_food_model.keras              # File bobot model AI hasil training
├── calorie_dict.json                  # Database nilai kalori per kelas makanan
└── food_calorie_classification.ipynb  # Skrip training model AI
```

### Catatan Penting Saat Menambahkan Data Baru
Jika Anda menambahkan kelas gambar makanan baru ke dalam folder `Dataset/` (misalnya menambahkan folder `Seblak/`), Anda **WAJIB** menambahkan data kalorinya ke dalam file `calorie_dict.json`. 

Contoh penambahan di `calorie_dict.json`:
```json
{
    "Anggur": 69,
    "Apel": 52,
    "Ayam Goreng": 246,
    "Seblak": 262
}
```
*Pastikan penulisan nama kunci (key) di file JSON sama persis dengan nama folder kelas makanan di dalam direktori Dataset (memperhatikan huruf kapital dan spasi).*

Setelah file JSON diperbarui, buka `food_calorie_classification.ipynb` dan jalankan ulang semua sel (Run All) untuk melatih ulang (retrain) model AI Anda agar kelas yang baru dapat dikenali.

---

## Tangkapan Layar (Screenshots)

(Tambahkan gambar screenshot aplikasi Anda di sini nanti)
- `![Home Page](/path/to/home.png)`
- `![Scanner](/path/to/scan.png)`
- `![Profile](/path/to/profile.png)`

---

## Lisensi
Proyek ini dibuat untuk tujuan edukasi dan portofolio. Bebas digunakan dan dikembangkan lebih lanjut.
