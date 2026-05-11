'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SECRET = 'cert0188*';

export default function HiddenAdminTrigger() {
  const router = useRouter();
  const bufRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key.length > 1) return; // skip Shift, Control, Enter, etc.
      bufRef.current += e.key;

      // Keep only the last N chars (length of secret)
      if (bufRef.current.length > SECRET.length) {
        bufRef.current = bufRef.current.slice(-SECRET.length);
      }

      // Reset buffer after 2s of inactivity
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { bufRef.current = ''; }, 2000);

      if (bufRef.current === SECRET) {
        bufRef.current = '';
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return null;
}
