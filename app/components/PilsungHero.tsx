'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PilsungHero() {
  const router = useRouter();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
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
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '21/9',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        background: 'var(--surface-high)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      title=""
    >
      <Image
        src="/pilsung2.png"
        alt="certmin hero"
        fill
        priority
        unoptimized
        style={{ objectFit: 'cover' }}
        className="crt-flicker"
      />
      <div className="scanline-overlay" />
    </div>
  );
}
