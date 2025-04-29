import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SubtitlePreviewProps {
  lines: string[];  // Changed from preview to lines to match usage
}

export default function SubtitlePreview({ lines }: SubtitlePreviewProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Subtitle Preview</h3>
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lines.join("\n")}
        </ReactMarkdown>
      </div>
    </div>
  );
}