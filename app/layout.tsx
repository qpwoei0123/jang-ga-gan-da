import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Wedding News | 한원영·이나경",
  description: "10년을 함께한 한원영·이나경의 결혼 소식과 가족식 안내를 담은 8면 웨딩 신문입니다.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
