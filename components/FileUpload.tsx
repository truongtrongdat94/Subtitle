"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";

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
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
        if (result.videoUrl) {
          setVideoUrl(result.videoUrl);
        }
      } else {
        throw new Error(result.error || "Không thể xử lý file");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      setLocalProgress(0);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
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
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {file ? file.name : 'Kéo thả file video vào đây'}
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Hoặc
          </p>
        </div>
        
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".mp4,.avi,.mkv,.mp3"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Chọn file
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="source-language-select" className="block text-sm font-medium text-gray-700">
            Ngôn ngữ nguồn
          </label>
          <select
            id="source-language-select"
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="en">Tiếng Anh</option>
            <option value="vi">Tiếng Việt</option>
            <option value="es">Tiếng Tây Ban Nha</option>
            <option value="fr">Tiếng Pháp</option>
            <option value="ja">Tiếng Nhật</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="target-language-select" className="block text-sm font-medium text-gray-700">
            Ngôn ngữ đích
          </label>
          <select
            id="target-language-select"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">Tiếng Anh</option>
            <option value="es">Tiếng Tây Ban Nha</option>
            <option value="fr">Tiếng Pháp</option>
            <option value="ja">Tiếng Nhật</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleUpload} 
          disabled={!file || progress > 0}
          className="w-full md:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {progress > 0 ? 'Đang xử lý...' : 'Bắt đầu chuyển đổi'}
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {videoUrl && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Video với phụ đề</h3>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer videoUrl={videoUrl} />
          </div>
        </div>
      )}

      {srtLines.length > 0 && (
        <div className="flex justify-center">
          <Button 
            onClick={handleDownloadSRT} 
            className="bg-green-600 hover:bg-green-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải file SRT
          </Button>
        </div>
      )}
    </div>
  );
}