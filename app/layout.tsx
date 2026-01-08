import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "상병 윤민규의 블로그",
  description: "DungGeunMo 폰트를 사용한 레트로 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
