import "./globals.css";

export const metadata = {
  title: "Video to SRT",
  description: "Convert video to SRT subtitles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}