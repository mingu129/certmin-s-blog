import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "certmin",
  description: "일상과 생각을 기록하는 개인 블로그",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={manrope.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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
            backgroundColor: "var(--glass-nav-bg)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border-subtle)",
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
                  color: "var(--primary)",
                  letterSpacing: "-0.04em",
                  textDecoration: "none",
                }}
              >
                certmin
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

            <ThemeToggle />
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
            <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>
              certmin
            </span>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: "0.9em",
              }}
            >
              © 2026 certmin. Built for the archive.
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
                  color: "var(--text-muted)",
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
