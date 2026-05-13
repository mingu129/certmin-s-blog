'use client';

import { useState, useRef } from 'react';
import React from 'react';

const LANG_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  python: 'Python',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  zsh: 'Zsh',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  xml: 'XML',
  sql: 'SQL',
  rust: 'Rust',
  go: 'Go',
  java: 'Java',
  kotlin: 'Kotlin',
  swift: 'Swift',
  cpp: 'C++',
  c: 'C',
  cs: 'C#',
  ruby: 'Ruby',
  php: 'PHP',
  markdown: 'Markdown',
  md: 'Markdown',
  dockerfile: 'Dockerfile',
  nginx: 'Nginx',
};

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const codeChild = React.Children.toArray(children).find(
    (c) => React.isValidElement(c) && (c as React.ReactElement).type === 'code'
  ) as React.ReactElement<{ className?: string }> | undefined;

  const lang = codeChild?.props?.className?.match(/language-(\w+)/)?.[1] ?? null;
  const label = lang ? (LANG_LABELS[lang] ?? lang.toUpperCase()) : null;

  async function handleCopy() {
    const text = preRef.current?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block-wrap">
      <div className="code-block-bar">
        {label ? (
          <span className="code-lang-badge">{label}</span>
        ) : (
          <span />
        )}
        <button className="code-copy-btn" onClick={handleCopy} title="클립보드에 복사">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
