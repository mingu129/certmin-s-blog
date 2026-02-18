import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "윤민규의 블로그",
  description: "일상과 생각을 기록하는 개인 블로그",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <div>
              <div className="site-title">
                <Link href="/">윤민규의 블로그</Link>
              </div>
              <div className="site-subtitle">일상과 생각을 기록합니다</div>
            </div>
          </div>
        </header>

        <nav className="site-nav">
          <div className="site-nav-inner">
            <Link href="/">홈</Link>
            <Link href="/blog">글 목록</Link>
          </div>
        </nav>

        {children}

        <footer className="site-footer">
          <p>© 2026 윤민규의 블로그</p>
        </footer>
      </body>
    </html>
  );
}
