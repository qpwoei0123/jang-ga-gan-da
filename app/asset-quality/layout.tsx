import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "에셋 적용 4단계 | 결혼일보 편집 기준",
  description: "뚜이와 윌 스미스 컷아웃을 신문 지면에 적용하는 네 가지 완성도 기준입니다.",
};

export default function AssetQualityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
