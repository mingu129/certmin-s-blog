import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

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
    <html lang="ko" className={manrope.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Fixed glass nav */}
        <header
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 50,
            backgroundColor: "rgba(13, 14, 17, 0.6)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 32px",
              maxWidth: "1280px",
              margin: "0 auto",
              fontFamily: "var(--font-manrope, Manrope), sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
              <Link
                href="/"
                style={{
                  fontSize: "1.35em",
                  fontWeight: 800,
                  color: "#b8c4ff",
                  letterSpacing: "-0.04em",
                  textDecoration: "none",
                }}
              >
                윤민규 블로그
              </Link>
              <div
                style={{
                  display: "flex",
                  gap: "28px",
                  fontSize: "0.88em",
                  letterSpacing: "-0.01em",
                }}
              >
                <Link href="/" className="nav-link">홈</Link>
                <Link href="/blog" className="nav-link">글 목록</Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Page content offset for fixed nav */}
        <div style={{ paddingTop: "72px" }}>{children}</div>

        {/* Footer */}
        <footer className="site-footer">
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              opacity: 0.8,
            }}
          >
            <span style={{ fontWeight: 700, color: "#a9abb2" }}>
              윤민규 블로그
            </span>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: "0.9em",
              }}
            >
              © 2026 윤민규의 블로그. Built for the archive.
            </span>
            <div style={{ display: "flex", gap: "24px" }}>
              <a
                href="https://github.com/mingu129"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: "0.9em",
                  color: "#a9abb2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
