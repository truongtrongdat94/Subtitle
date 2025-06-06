import whisper
import sys
import json

def format_timestamp(seconds):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02},{milliseconds:03}"

def transcribe_audio(audio_path, model_name, language):
    model = whisper.load_model(model_name)
    result = model.transcribe(audio_path, language=language)
    return result["segments"]

def create_srt(segments, srt_path):
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, segment in enumerate(segments, start=1):
            start_time = format_timestamp(segment["start"])
            end_time = format_timestamp(segment["end"])
            text = segment["text"].strip()
            f.write(f"{i}\n{start_time} --> {end_time}\n{text}\n\n")

def create_vtt(segments, vtt_path):
    with open(vtt_path, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for i, segment in enumerate(segments, start=1):
            start_time = format_timestamp(segment["start"]).replace(",", ".")
            end_time = format_timestamp(segment["end"]).replace(",", ".")
            text = segment["text"].strip()
            f.write(f"{i}\n{start_time} --> {end_time}\n{text}\n\n")

def create_txt(segments, txt_path):
    with open(txt_path, "w", encoding="utf-8") as f:
        for segment in segments:
            f.write(f"{segment['text'].strip()}\n")

if __name__ == "__main__":
    audio_path = sys.argv[1]
    model_name = sys.argv[2]
    language = sys.argv[3]
    srt_path = sys.argv[4]
    vtt_path = sys.argv[5]
    txt_path = sys.argv[6]
    format_type = sys.argv[7]

    segments = transcribe_audio(audio_path, model_name, language)
    if format_type == "srt":
        create_srt(segments, srt_path)
    elif format_type == "vtt":
        create_vtt(segments, vtt_path)
    else:
        create_txt(segments, txt_path)

    # In ra segments để lấy preview
    preview = [segment["text"] for segment in segments[:5]]
    print(json.dumps({"segments": segments, "preview": preview}))