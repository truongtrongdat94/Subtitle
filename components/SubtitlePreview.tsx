import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SubtitlePreviewProps {
  lines: string[];
}

export default function SubtitlePreview({ lines }: SubtitlePreviewProps) {
  return (
    <div className="subtitle-preview">
      <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[400px] text-sm">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="text-left py-2 px-4 text-gray-600 font-medium">STT</th>
              <th className="text-left py-2 px-4 text-gray-600 font-medium">Nội dung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 text-gray-500 font-mono">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {line}
                    </ReactMarkdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}