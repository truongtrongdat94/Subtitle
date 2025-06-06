# Video to SRT Converter

This project converts video files to SRT subtitles and translates the subtitles into a target language using Whisper and Gemini API.

## Structure
- `backend/`: FastAPI backend for transcription and translation.
- `app/`: Next.js frontend for the web interface.

## Setup
1. **Backend**:
   - Navigate to `backend/`.
   - Create a virtual environment: `python -m venv venv`
   - Activate it: `.\venv\Scripts\activate`
   - Install dependencies: `pip install -r requirements.txt`
   - Create a `.env` file with your Gemini API key: `GEMINI_API_KEY=your_api_key`
   - Run the backend: `uvicorn main:app --host 0.0.0.0 --port 8000`

2. **Frontend**:
   - Navigate to the root directory.
   - Install dependencies: `npm install`
   - Run the frontend: `npm run dev`

## Usage
- Open `http://localhost:3000` in your browser.
- Upload a video, select source and target languages, and click "Convert" to get translated SRT subtitles.