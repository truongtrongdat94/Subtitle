import { NextRequest, NextResponse } from "next/server";
import { textToSRT } from "@/lib/speechToText";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const sourceLanguage = formData.get("sourceLanguage") as string;
    const targetLanguage = formData.get("targetLanguage") as string;

    if (!file || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { success: false, error: "Missing file or language" },
        { status: 400 }
      );
    }

    // Chuyển đổi file thành Blob nếu cần
    const fileBlob = file instanceof Blob ? file : new Blob([file]);
    
    // Gửi file và ngôn ngữ đến backend Python
    const pythonFormData = new FormData();
    pythonFormData.append("file", fileBlob, (file as File).name);
    pythonFormData.append("language", sourceLanguage);
    pythonFormData.append("targetLanguage", targetLanguage);

    const response = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: pythonFormData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to transcribe");
    }

    // Dịch văn bản và tạo SRT
    const srtLines = await textToSRT(result.srtLines, sourceLanguage, targetLanguage);

    return NextResponse.json({ success: true, srtLines });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: `Error processing file: ${error}` },
      { status: 500 }
    );
  }
}