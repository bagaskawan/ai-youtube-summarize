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

# --- Konfigurasi (Tidak berubah) ---
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

# --- PERBAIKAN 1: Ekstrak Info Video ---
def get_video_info(url: str) -> dict:
    """Mengambil metadata video dan mendownload audionya."""
    temp_dir = tempfile.gettempdir()
    temp_filename_base = os.path.join(temp_dir, f"{uuid.uuid4()}")

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{temp_filename_base}.%(ext)s',
        'quiet': True,
        'noplaylist': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        downloaded_file_path = f"{temp_filename_base}.{info['ext']}"

    if not os.path.exists(downloaded_file_path):
        raise FileNotFoundError("Downloaded audio file not found.")

    # Kumpulkan semua data yang kita butuhkan
    video_info = {
        "audio_path": downloaded_file_path,
        "extension": info.get('ext'),
        "title": info.get('title'),
        "thumbnail": info.get('thumbnail'),
        "channel": info.get('channel')
    }
    return video_info

def summarize_audio_with_gemini(audio_path: str, extension: str) -> str:
    # ... (Fungsi ini tidak ada perubahan)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
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
        # --- PERBAIKAN 2: Gunakan fungsi baru dan ambil semua info ---
        print(f"Mulai: Mengambil info dan audio dari {request.videoUrl}")
        video_info = get_video_info(request.videoUrl)
        audio_path = video_info["audio_path"]
        
        print(f"Audio diunduh. Memproses dengan Gemini Flash...")
        summary = summarize_audio_with_gemini(audio_path, video_info["extension"])

        print("Ringkasan berhasil dibuat!")
        
        # --- PERBAIKAN 3: Kirim semua data ke frontend ---
        return {
            "summary": summary,
            "title": video_info["title"],
            "thumbnail": video_info["thumbnail"],
            "channel": video_info["channel"]
        }
        
    except Exception as e:
        print(f"Terjadi error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)
            print(f"File temporer dibersihkan: {audio_path}")