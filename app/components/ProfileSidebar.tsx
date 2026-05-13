import Image from 'next/image';
import Link from 'next/link';

interface Props {
  profileName: string;
  profileDescription: string;
  profilePhoto: string | null;
}

export default function ProfileSidebar({ profileName, profileDescription, profilePhoto }: Props) {
  return (
    <>
      {/* Profile block */}
      <div className="sidebar-block">
        <div className="sidebar-block-title">소개</div>
        <div className="sidebar-about">

          <div style={{ position: 'relative', width: 136, height: 136, flexShrink: 0, marginBottom: 16 }}>
            <div style={{ position: 'absolute', top: 10, left: 10, width: 116, height: 116 }}>
              {profilePhoto ? (
                <Image src={profilePhoto} alt={profileName} fill style={{ objectFit: 'cover' }} unoptimized />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#05080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-fixed)', fontSize: '26px' }}>person</span>
                </div>
              )}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/scFrameCropped.png"
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none', zIndex: 1 }}
            />
          </div>

          <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{profileName}</div>
          <div style={{ fontSize: '0.88em', color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{profileDescription}</div>
        </div>
      </div>

      {/* Links block */}
      <div className="sidebar-block">
        <div className="sidebar-block-title">링크</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85em', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>article</span>글 목록
          </Link>
          <a href="https://github.com/mingu129" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85em', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>code</span>GitHub
          </a>
        </div>
      </div>
    </>
  );
}
