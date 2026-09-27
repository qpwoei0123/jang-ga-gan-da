import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Wedding News | 한원영·이나경",
  description: "11년을 함께한 한원영·이나경의 결혼 소식과 웨딩 화보, 가족식 안내를 담은 웨딩 신문입니다.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#f5f4f1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ backgroundColor: "#f5f4f1", colorScheme: "light" }}>
      <body style={{ backgroundColor: "#f5f4f1" }}>{children}</body>
    </html>
  );
}
