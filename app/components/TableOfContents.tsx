'use client';

import { useEffect, useState } from 'react';

export interface TocHeading {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('post-top');

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-heading-id]');
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-heading-id') ?? 'post-top');
          }
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <a
        className={`sidebar-toc-link${activeId === 'post-top' ? ' active' : ''}`}
        href="#post-top"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>subject</span>
        시작
      </a>

      {headings.map((h) => (
        <a
          key={h.id}
          className={`sidebar-toc-link${activeId === h.id ? ' active' : ''}`}
          href={`#${h.id}`}
          style={{
            paddingLeft: h.level === 1 ? '16px' : h.level === 2 ? '24px' : '32px',
            fontSize: h.level === 1 ? '0.88em' : '0.82em',
            opacity: h.level === 3 ? 0.75 : 1,
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
