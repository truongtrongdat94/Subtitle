import { translateText } from "./translate";

export async function textToSRT(
  srtLines: string[],
  sourceLang: string,
  targetLang: string
): Promise<string[]> {
  if (sourceLang === targetLang) return srtLines;

  const translatedSrtLines: string[] = [];
  let currentIndex = 0;

  // Gộp tất cả đoạn text để dịch cùng lúc
  const textsToTranslate: string[] = [];
  const segmentIndices: number[] = [];
  for (let i = 0; i < srtLines.length; i += 4) {
    const index = srtLines[i];
    const time = srtLines[i + 1];
    const text = srtLines[i + 2];

    if (!index || !time || !text) continue;

    textsToTranslate.push(text);
    segmentIndices.push(currentIndex);

    translatedSrtLines[currentIndex] = index;
    translatedSrtLines[currentIndex + 1] = time;
    translatedSrtLines[currentIndex + 3] = "";
    currentIndex += 4;
  }

  // Dịch toàn bộ văn bản cùng lúc
  const translatedTexts = await translateText(
    textsToTranslate.join("\n"),
    sourceLang,
    targetLang
  );

  // Tách kết quả dịch và gán lại
  const translatedLines = translatedTexts.split("\n");
  for (let i = 0; i < segmentIndices.length; i++) {
    translatedSrtLines[segmentIndices[i] + 2] = translatedLines[i] || textsToTranslate[i];
  }

  return translatedSrtLines;
}