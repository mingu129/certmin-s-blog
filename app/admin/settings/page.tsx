'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [siteSubtitle, setSiteSubtitle] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileDescription, setProfileDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setSiteSubtitle(data.siteSubtitle || '');
        setProfileName(data.profileName || '');
        setProfileDescription(data.profileDescription || '');
        setProfilePhoto(data.profilePhoto || '');
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  async function handlePhotoUpload(file: File) {
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setProfilePhoto(data.url);
      else setError('사진 업로드 실패');
    } catch {
      setError('사진 업로드 실패');
    } finally {
      setPhotoLoading(false);
    }
  }

  async function handleSave() {
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteSubtitle, profileName, profileDescription, profilePhoto: profilePhoto || null }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const data = await res.json();
        setError(data.error || '저장 실패');
      }
    } catch {
      setError('저장 실패');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin');
  }

  const fieldLabel = (text: string) => (
    <div style={{ fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '10px' }}>
      {text}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--surface-high)',
    border: 'none',
    borderRadius: '0.5rem',
    color: 'var(--text)',
    fontSize: '0.92em',
    fontFamily: 'inherit',
    outline: 'none',
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)', gap: '10px', color: 'var(--text-muted)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--accent)' }}>hourglass_empty</span>
        불러오는 중...
      </div>
    );
  }

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '80px', paddingBottom: '96px', padding: '80px 32px 96px', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>

      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: 'var(--surface)', borderRadius: '0.5rem', padding: '24px', position: 'sticky', top: '96px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.95em', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>관리 콘솔</div>
          <div style={{ fontSize: '0.7em', color: 'var(--text-muted)' }}>Admin Dashboard</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { icon: 'dashboard', label: '개요', href: '/admin/write', active: false },
            { icon: 'article', label: '글 목록', href: '/admin/write', active: false },
            { icon: 'tune', label: '블로그 설정', href: '/admin/settings', active: true },
          ].map(({ icon, label, href, active }) => (
            <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0 10px 16px', fontSize: '0.88em', color: active ? 'var(--accent)' : 'var(--text-muted)', fontWeight: active ? 700 : 400, borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
              {label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--border-faint)', margin: '8px 0' }} />
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0 10px 16px', fontSize: '0.88em', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
            홈으로
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0 10px 16px', fontSize: '0.88em', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            로그아웃
          </button>
        </nav>
      </aside>

      {/* Main canvas */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Header */}
        <header>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', background: 'var(--pill-bg)', fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--secondary-container-text)', marginBottom: '12px' }}>
            블로그 설정
          </div>
          <h1 style={{ fontSize: '2.2em', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: '8px' }}>
            프로필 & 사이트 설정
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92em' }}>
            메인 페이지에 표시되는 소개 정보를 수정합니다.
          </p>
        </header>

        {/* Form */}
        <div style={{ background: 'var(--surface)', borderRadius: '0.75rem', padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Profile photo */}
          <div>
            {fieldLabel('프로필 사진')}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', background: 'var(--surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid var(--accent-ring)' }}>
                {profilePhoto ? (
                  <Image src={profilePhoto} alt="profile" width={72} height={72} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
                ) : (
                  <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '32px' }}>person</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); e.target.value = ''; }}
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--surface-high)', border: 'none', borderRadius: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82em', fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{photoLoading ? 'hourglass_empty' : 'upload'}</span>
                  {photoLoading ? '업로드 중...' : '사진 업로드'}
                </button>
                {profilePhoto && (
                  <button onClick={() => setProfilePhoto('')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'none', border: 'none', color: 'var(--error)', fontSize: '0.78em', fontFamily: 'inherit', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                    사진 제거
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile name */}
          <div>
            {fieldLabel('이름')}
            <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="이름" style={inputStyle}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px var(--accent-ring)'; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Site subtitle */}
          <div>
            {fieldLabel('블로그 부제목')}
            <input type="text" value={siteSubtitle} onChange={(e) => setSiteSubtitle(e.target.value)} placeholder="메인 페이지 히어로 아래 표시되는 한 줄 소개" style={inputStyle}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px var(--accent-ring)'; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Profile description */}
          <div>
            {fieldLabel('프로필 설명')}
            <textarea
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
              placeholder="사이드바에 표시되는 소개글 (줄바꿈 가능)"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px var(--accent-ring)'; }}
              onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Save */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '8px' }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '0.5rem', fontSize: '0.82em', fontWeight: 700, fontFamily: 'inherit', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px var(--accent-soft-hover)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
              {loading ? '저장 중...' : '저장'}
            </button>
            {saved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.85em' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                저장되었습니다.
              </span>
            )}
            {error && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', fontSize: '0.85em' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {error}
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
