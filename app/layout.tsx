import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-edition-newspaper.han-10.chatgpt.site"),
  title: "원영 · 나경 | The Wedding News",
  description: "2026년 11월 1일, 11년을 함께한 원영과 나경의 결혼 소식을 담은 웨딩 신문입니다.",
  openGraph: {
    type: "website",
    title: "원영 · 나경, 결혼합니다",
    description: "2026년 11월 1일, 두 사람의 결혼 소식을 전합니다.",
    images: [{ url: "/og.png?v=3", width: 1733, height: 908, alt: "빨간 신발을 나란히 신은 웨딩 사진 위에 적힌 11년 연애 끝, 결혼합니다. 26.11.01" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "원영 · 나경, 결혼합니다",
    description: "2026년 11월 1일, 두 사람의 결혼 소식을 전합니다.",
    images: ["/og.png?v=3"],
  },
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
