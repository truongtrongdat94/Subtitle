import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function transcribeAudio(
  audioPath: string,
  modelName: string,
  language: string,
  format: string
): Promise<{ segments: any[]; preview: string[] }> {
  const srtPath = audioPath.replace(".mp3", ".srt");
  const vttPath = audioPath.replace(".mp3", ".vtt");
  const txtPath = audioPath.replace(".mp3", ".txt");

  const command = `python whisper_script.py "${audioPath}" "${modelName}" "${language}" "${srtPath}" "${vttPath}" "${txtPath}" "${format}"`;
  const { stdout } = await execAsync(command);
  return JSON.parse(stdout);
}

