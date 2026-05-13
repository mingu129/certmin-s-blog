import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import HiddenAdminTrigger from "./components/HiddenAdminTrigger";

export const metadata: Metadata = {
  title: "certmin",
  description: "기록용 개인 블로그",
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
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
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
          <nav className="nav-inner">
            <div className="nav-logo-group">
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
              <div className="nav-links">
                <Link href="/" className="nav-link">홈</Link>
                <Link href="/blog" className="nav-link">글 목록</Link>
              </div>
            </div>

            <ThemeToggle />
          </nav>
        </header>

        <HiddenAdminTrigger />
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
              © 2026 certmin. Built for the archive maybe?
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
