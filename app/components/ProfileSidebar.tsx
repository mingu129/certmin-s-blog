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
          <div
            style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: 'var(--surface-high)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px', overflow: 'hidden',
              border: '2px solid var(--accent-soft-hover)', flexShrink: 0,
            }}
          >
            {profilePhoto ? (
              <Image src={profilePhoto} alt={profileName} width={88} height={88} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
            ) : (
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-fixed)', fontSize: '36px' }}>person</span>
            )}
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
