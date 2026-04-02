'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  profileName: string;
  profileDescription: string;
  profilePhoto: string | null;
}

export default function ProfileSidebar({ profileName, profileDescription, profilePhoto }: Props) {
  const router = useRouter();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleProfileClick() {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      router.push('/admin');
      return;
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1500);
  }

  return (
    <>
      {/* Profile block */}
      <div className="sidebar-block">
        <div className="sidebar-block-title">소개</div>
        <div className="sidebar-about">
          <div
            onClick={handleProfileClick}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--surface-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              cursor: 'pointer',
              overflow: 'hidden',
              border: '2px solid rgba(90,122,248,0.15)',
              transition: 'border-color 0.2s',
              userSelect: 'none',
              flexShrink: 0,
            }}
            title=""
          >
            {profilePhoto ? (
              <Image
                src={profilePhoto}
                alt={profileName}
                width={52}
                height={52}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                unoptimized
              />
            ) : (
              <span className="material-symbols-outlined" style={{ color: '#5a7af8', fontSize: '24px' }}>
                person
              </span>
            )}
          </div>

          <div style={{ fontWeight: 700, color: '#e4e5ed', marginBottom: '8px' }}>
            {profileName}
          </div>
          <div style={{ fontSize: '0.88em', color: '#a9abb2', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {profileDescription}
          </div>
        </div>
      </div>

      {/* Links block */}
      <div className="sidebar-block">
        <div className="sidebar-block-title">링크</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/blog"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85em', color: '#a9abb2', textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>article</span>
            글 목록
          </Link>
          <a
            href="https://github.com/mingu129"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85em', color: '#a9abb2', textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>code</span>
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
