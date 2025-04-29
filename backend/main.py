import ffmpeg
import whisper
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uuid

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {'Yes' if GEMINI_API_KEY else 'No'}")  # Debug log
print(f"API Key length: {len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")  # Debug log

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)
model = whisper.load_model("base")
gemini_model = genai.GenerativeModel("gemini-1.5-flash")  # Changed back to gemini-1.5-flash

async def extract_audio(video_path: str, audio_path: str):
    try:
        stream = ffmpeg.input(video_path)
        stream = ffmpeg.output(stream, audio_path, acodec="pcm_s16le", ar="8000", ac=1, f="wav")
        ffmpeg.run(stream, overwrite_output=True)
    except ffmpeg.Error as e:
        raise Exception(f"Error extracting audio: {e.stderr.decode()}")

async def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    try:
        # Map language codes to full names for Gemini prompt
        lang_map = {
            "ja": "Japanese",
            "en": "English",
            "es": "Spanish",
            "vi": "Vietnamese",
            "fr": "French"
        }
        source_lang_name = lang_map.get(source_lang, source_lang)
        target_lang_name = lang_map.get(target_lang, target_lang)
        
        print(f"Attempting translation from {source_lang_name} to {target_lang_name}")
        
        # Create prompt for Gemini to translate text with strict instructions
        prompt = f"""Please translate this text from {source_lang_name} to {target_lang_name}.
IMPORTANT: 
1. Translate EXACTLY line by line
2. Keep the same number of lines
3. Do NOT add any additional text or explanations
4. Only return the translated text, nothing else

Text to translate:
{text}"""
        
        response = gemini_model.generate_content(prompt)
        translated_text = response.text.strip()
        return translated_text
    except Exception as e:
        print(f"Translation error details: {str(e)}")
        raise Exception(f"Error translating text: {str(e)}")

def format_time(seconds: float) -> str:
    """Convert seconds to SRT time format HH:MM:SS,mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:06.3f}".replace(".", ",")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), language: str = Form(...), targetLanguage: str = Form(...)):
    try:
        video_path = f"temp_{uuid.uuid4()}.mp4"
        audio_path = f"temp_{uuid.uuid4()}.wav"

        with open(video_path, "wb") as f:
            f.write(await file.read())

        await extract_audio(video_path, audio_path)

        result = model.transcribe(
            str(audio_path),
            language=language,
            verbose=True,
            word_timestamps=False,
            fp16=True,
        )

        # Collect all segments' text into a single block with separators
        segments = result["segments"]
        texts = [segment["text"].strip() for segment in segments]
        combined_text = '\n'.join(texts)

        # Translate the entire block in one API request
        translated_block = await translate_text(combined_text, language, targetLanguage)
        translated_texts = translated_block.splitlines()
        
        # Ensure we have enough translated lines
        if len(translated_texts) < len(segments):
            translated_texts.extend([''] * (len(segments) - len(translated_texts)))
        elif len(translated_texts) > len(segments):
            translated_texts = translated_texts[:len(segments)]

        # Format the translated text into SRT
        srt_lines = []
        for i, (segment, translated_text) in enumerate(zip(segments, translated_texts), 1):
            start_time = format_time(segment["start"])
            end_time = format_time(segment["end"])
            srt_lines.extend([
                str(i),
                f"{start_time} --> {end_time}",
                translated_text.strip() or segment["text"].strip(),
                ""  # Empty line between subtitles
            ])

        os.remove(video_path)
        os.remove(audio_path)

        return {"success": True, "srtLines": srt_lines}
    except Exception as e:
        if os.path.exists(video_path):
            os.remove(video_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)
        return {"success": False, "error": str(e)}