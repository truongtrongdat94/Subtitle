"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import SubtitlePreview from "@/components/SubtitlePreview";

export default function Home() {
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string[]>([]);

  return (
    <div className="min-h-screen p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Video to SRT Converter</h1>
      </header>
      <main className="space-y-6">
        <FileUpload 
          setProgress={setProgress}
          setResult={setResult}
          setPreview={setPreview}
        />
        {progress > 0 && <ProgressBar progress={progress} />}
        {preview.length > 0 && <SubtitlePreview lines={preview} />}
      </main>
    </div>
  );
}