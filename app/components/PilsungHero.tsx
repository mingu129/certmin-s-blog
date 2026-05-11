import Image from 'next/image';

export default function PilsungHero() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '21/9',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        background: 'var(--surface-high)',
      }}
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
