import os
import io
import json
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI(title="Caloricam AI Service")

# Konfigurasi CORS agar bisa diakses oleh Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Dalam tahap development, izinkan semua domain. Nanti bisa disesuaikan dengan URL Frontend spesifik.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path ke model Keras
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "Model", "best_food_model.keras")

# Global variable untuk menampung model
model = None

# Sama dengan ukuran IMG_SIZE saat training
IMG_SIZE = (224, 224) 

# Membaca kamus kalori dari file JSON
CALORIE_DICT_PATH = os.path.join(os.path.dirname(__file__), "..", "Model", "calorie_dict.json")
try:
    with open(CALORIE_DICT_PATH, "r") as f:
        calorie_dict = json.load(f)
except FileNotFoundError:
    print(f"⚠️ Peringatan: File {CALORIE_DICT_PATH} tidak ditemukan. Menggunakan dictionary kosong.")
    calorie_dict = {}

# Daftar class sesuai urutan dataset alfabet
class_names = sorted(list(calorie_dict.keys()))

@app.on_event("startup")
async def load_model():
    """Memuat model ke memori saat server berjalan pertama kali agar respons prediksi lebih cepat."""
    global model
    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"✅ Model AI berhasil dimuat dari: {MODEL_PATH}")
        except Exception as e:
            print(f"❌ Gagal memuat model: {e}")
    else:
        print(f"⚠️ Model tidak ditemukan di path: {MODEL_PATH}")
        print("Pastikan Anda sudah menjalankan Jupyter Notebook dan melatih modelnya.")

@app.get("/")
def read_root():
    return {"message": "AI Service berjalan normal. Gunakan endpoint /predict untuk klasifikasi gambar."}

@app.post("/predict")
async def predict_food(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum siap atau tidak ditemukan.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar.")

    try:
        # Membaca gambar dari request
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocessing gambar (Resize ke 224x224)
        image = image.resize(IMG_SIZE)
        img_array = tf.keras.preprocessing.image.img_to_array(image)
        img_array = tf.expand_dims(img_array, 0) # Menambahkan dimensi batch (1, 224, 224, 3)

        # Melakukan prediksi (Model output sudah dalam bentuk Softmax probability)
        predictions = model.predict(img_array)
        score = predictions[0]
        
        predicted_idx = np.argmax(score)
        predicted_class = class_names[predicted_idx]
        confidence = float(np.max(score)) * 100
        estimated_calories = calorie_dict.get(predicted_class, 0)

        return {
            "success": True,
            "prediction": predicted_class,
            "confidence": f"{confidence:.2f}%",
            "nutrition": {
                "calories": estimated_calories,
                "protein": 0,
                "fat": 0,
                "carbs": 0,
                "unit": "1 porsi standar"
            },
            "message": "Prediksi berhasil"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses gambar: {str(e)}")

@app.get("/foods")
async def get_all_foods():
    foods_list = [
        {"name": key, "cal": value, "detail": "1 porsi standar"}
        for key, value in calorie_dict.items()
    ]
    return {
        "success": True,
        "data": foods_list
    }

if __name__ == "__main__":
    import uvicorn
    # Menjalankan server di port 8000 sesuai permintaan User
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
