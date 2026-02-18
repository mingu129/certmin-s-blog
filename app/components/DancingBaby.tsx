'use client';

import { useRouter } from 'next/navigation';

export default function DancingBaby() {
  const router = useRouter();

  return (
    <img
      src="/dancing-baby.gif"
      alt="dancing baby"
      onDoubleClick={() => router.push('/admin')}
      style={{ maxWidth: '100%', imageRendering: 'pixelated', cursor: 'pointer' }}
    />
  );
}
