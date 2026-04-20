'use client';

import { useRouter } from 'next/navigation';

export default function HiddenAdminTrigger() {
  const router = useRouter();
  return (
    <div
      onDoubleClick={() => router.push('/admin')}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '14px',
        height: '14px',
        opacity: 0,
        cursor: 'default',
        userSelect: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
}
