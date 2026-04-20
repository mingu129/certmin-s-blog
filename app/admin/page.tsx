'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/write');
    } else {
      const data = await res.json();
      setError(data.error || '로그인 실패');
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'var(--surface)',
          borderRadius: '0.75rem',
          padding: '40px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--accent)', fontSize: '24px' }}>
              lock
            </span>
          </div>
          <h1
            style={{
              fontSize: '1.5em',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}
          >
            관리자 로그인
          </h1>
          <p style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>
            관리 콘솔에 접속하려면 비밀번호를 입력하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.72em',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--surface-high)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'var(--text)',
                fontSize: '0.95em',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 1px var(--accent-ring)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: 'var(--error)',
                fontSize: '0.82em',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.82em',
              fontWeight: 700,
              fontFamily: 'inherit',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'filter 0.2s',
            }}
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
