import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "결혼일보 | 한원영·이나경 특집호",
  description: "10년 만나고 결혼하는 한원영·이나경의 소식을 신문 한 호에 실었습니다.",
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
