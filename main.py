import os
import uuid
import tempfile
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# --- Memuat Konfigurasi ---
env_path = Path('.') / '.env.local'
load_dotenv(dotenv_path=env_path)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not found in .env.local")
genai.configure(api_key=gemini_api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    videoUrl: str

# --- FUNGSI DOWNLOAD YANG SUDAH DISEMPURNAKAN ---
def download_audio(url: str) -> tuple[str, str]:
    """
    Mendownload audio dalam format terbaik yang tersedia dan mengembalikan path serta nama file.
    Tidak ada lagi konversi, tidak ada lagi tebak format!
    """
    temp_dir = tempfile.gettempdir()
    # Membuat nama file unik tapi tanpa ekstensi dulu
    temp_filename_base = os.path.join(temp_dir, f"{uuid.uuid4()}")

    ydl_opts = {
        # 'bestaudio/best': Biarkan yt-dlp memilih format audio terbaik.
        # -f ba: singkatan dari format bestaudio
        'format': 'bestaudio/best',
        'outtmpl': f'{temp_filename_base}.%(ext)s', # Biarkan yt-dlp yang menentukan ekstensinya
        'quiet': True,
        'noplaylist': True, # Pastikan hanya download satu video
    }

    downloaded_file_path = ""
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        # yt-dlp akan otomatis menambahkan ekstensi (.m4a, .webm, dll)
        downloaded_file_path = f"{temp_filename_base}.{info['ext']}"

    if not os.path.exists(downloaded_file_path):
        raise FileNotFoundError("Downloaded audio file not found.")

    return downloaded_file_path, info['ext'] # Kembalikan path dan ekstensinya

def summarize_audio_with_gemini(audio_path: str, extension: str) -> str:
    """Mengirim file audio langsung ke Gemini dengan tipe mime yang benar."""
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    # Menentukan Mime Type berdasarkan ekstensi file
    mime_type = f"audio/{extension}"
    
    print(f"Uploading {audio_path} with mime_type: {mime_type}...")
    audio_file = genai.upload_file(path=audio_path, mime_type=mime_type)
    print("Upload complete.")

    prompt = "You are an expert video summarizer. Listen to the provided audio file. First, understand the content, then provide a concise summary in Indonesian using bullet points. If there is no speech, just say 'No speech detected in the audio.'"

    response = model.generate_content([prompt, audio_file])
    genai.delete_file(audio_file.name)
    return response.text

@app.post("/summarize")
async def create_summary(request: VideoRequest):
    audio_path = None
    try:
        print(f"Mulai: Mengunduh audio dari {request.videoUrl}")
        audio_path, extension = download_audio(request.videoUrl)
        
        print(f"Audio diunduh sebagai .{extension}. Memproses dengan Gemini Flash...")
        summary = summarize_audio_with_gemini(audio_path, extension)

        print("Ringkasan berhasil dibuat!")
        return {"summary": summary}
        
    except Exception as e:
        print(f"Terjadi error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)
            print(f"File temporer dibersihkan: {audio_path}")