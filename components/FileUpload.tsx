"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  setProgress: Dispatch<SetStateAction<number>>;
  setResult: Dispatch<SetStateAction<any>>;
  setPreview: Dispatch<SetStateAction<string[]>>;
}

export default function FileUpload({ setProgress, setResult, setPreview }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("vi");
  const [progress, setLocalProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [srtLines, setSrtLines] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn một file");
      return;
    }

    if (!sourceLanguage) {
      setError("Vui lòng chọn ngôn ngữ nguồn");
      return;
    }

    if (!targetLanguage) {
      setError("Vui lòng chọn ngôn ngữ đích");
      return;
    }

    try {
      setLocalProgress(10);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceLanguage", sourceLanguage);
      formData.append("targetLanguage", targetLanguage);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setLocalProgress(50);

      const result = await response.json();

      if (result.success) {
        setLocalProgress(100);
        setProgress(100);
        console.log("SRT Lines:", result.srtLines);
        setSrtLines(result.srtLines);
        setResult({ srtLines: result.srtLines });
        setPreview(result.srtLines);
      } else {
        throw new Error(result.error || "Không thể xử lý file");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      setLocalProgress(0);
      setProgress(0);
    }
  };

  const handleDownloadSRT = () => {
    if (!srtLines.length) return;

    const srtContent = srtLines.join("\n");
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium">
          Tải lên video hoặc âm thanh
        </label>
        <Input
          id="file-upload"
          type="file"
          accept=".mp4,.avi,.mkv,.mp3"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <label htmlFor="source-language-select" className="block text-sm font-medium">
          Chọn ngôn ngữ nguồn (ngôn ngữ của video/âm thanh)
        </label>
        <select
          id="source-language-select"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="en">Tiếng Anh</option>
          <option value="vi">Tiếng Việt</option>
          <option value="es">Tiếng Tây Ban Nha</option>
          <option value="fr">Tiếng Pháp</option>
          <option value="ja">Tiếng Nhật</option>
        </select>
      </div>
      <div>
        <label htmlFor="target-language-select" className="block text-sm font-medium">
          Chọn ngôn ngữ đích (ngôn ngữ của phụ đề)
        </label>
        <select
          id="target-language-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="en">Tiếng Anh</option>
          <option value="vi">Tiếng Việt</option>
          <option value="es">Tiếng Tây Ban Nha</option>
          <option value="fr">Tiếng Pháp</option>
          <option value="ja">Tiếng Nhật</option>
        </select>
      </div>
      <Button onClick={handleUpload} disabled={!file || progress > 0}>
        Tải lên
      </Button>
      {progress > 0 && (
        <div className="text-sm">
          Tiến trình: {progress}%
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm">
          Lỗi: {error}
        </div>
      )}
      {srtLines.length > 0 && (
        <div>
          <Button onClick={handleDownloadSRT} className="mt-2">
            Tải file SRT
          </Button>
        </div>
      )}
    </div>
  );
}