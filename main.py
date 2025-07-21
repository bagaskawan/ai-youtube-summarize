import os
import uuid
import tempfile # Menggunakan tempfile agar kompatibel di semua OS
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pantic import BaseModel
import yt_dlp
import openai
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Muat Konfigurasi
load_dotenv() # Membaca file .env.local
openai.api_key = os.getenv("OPENAI_API_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# 2. Inisialisasi Aplikasi FastAPI
app = FastAPI()

# 3. CORS Middleware (SANGAT PENTING)
# Mengizinkan frontend di localhost:3000 untuk mengakses backend ini.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Model Data Request
class VideoRequest(BaseModel):
    videoUrl: str

# 5. Fungsi-Fungsi Pembantu
def download_audio(url: str) -> str:
    """Mendownload audio dari URL YouTube menggunakan yt-dlp."""
    temp_file = tempfile.NamedTemporaryFile(suffix=".m4a", delete=False)
    temp_filename = temp_file.name
    temp_file.close()

    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        'outtmpl': temp_filename,
        'quiet': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return temp_filename

def transcribe_audio(audio_path: str) -> str:
    """Mengirim file audio ke OpenAI Whisper API untuk transkripsi."""
    with open(audio_path, "rb") as audio_file:
        transcript_response = openai.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"
        )
    return transcript_response

def summarize_text(text: str) -> str:
    """Mengirim teks transkrip ke Gemini API untuk diringkas."""
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"Summarize the following YouTube video transcript into concise bullet points, in Indonesian:\n\nTranscript: \"{text}\"\n\nSummary:"
    response = model.generate_content(prompt)
    return response.text

# 6. Endpoint API Utama
@app.post("/summarize")
async def create_summary(request: VideoRequest):
    """Menerima URL, memproses, dan mengembalikan ringkasan."""
    audio_path = None
    try:
        print(f"Mulai: Mengunduh audio dari {request.videoUrl}")
        audio_path = download_audio(request.videoUrl)
        
        print(f"Selesai diunduh. Mentranskrip audio dari: {audio_path}")
        transcript = transcribe_audio(audio_path)
        
        print("Transkrip selesai. Meringkas teks...")
        summary = summarize_text(transcript)

        print("Ringkasan berhasil dibuat!")
        return {"summary": summary}
        
    except Exception as e:
        print(f"Terjadi error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)
            print(f"File temporer dibersihkan: {audio_path}")