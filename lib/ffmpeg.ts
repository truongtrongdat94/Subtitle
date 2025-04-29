import { FFmpeg } from "@ffmpeg/ffmpeg";

export async function extractAudio(videoPath: string, audioPath: string): Promise<void> {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Đọc file video
  await ffmpeg.writeFile("input", new Uint8Array(await (await fetch(videoPath)).arrayBuffer()));

  // Chuyển đổi sang MP3
  await ffmpeg.exec(["-i", "input", "-q:a", "0", "-map", "a", audioPath]);

  // Đọc file đầu ra
  const data = await ffmpeg.readFile(audioPath);

  // Lưu file âm thanh
  const fs = require("fs");
  fs.writeFileSync(audioPath, Buffer.from(data as Uint8Array));

  // Dọn dẹp
  await ffmpeg.deleteFile("input");
}