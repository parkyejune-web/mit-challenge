import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIT Trading Challenge | Challenge Profit Batch 1",
  description: "Logika trading 0,1% yang tetap jalan saat Anda tidur—buktikan dengan $50. Challenge $50→$100.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="font-sans" style={{ fontFamily: "var(--font-sans)" }}>
      <body className="antialiased font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
