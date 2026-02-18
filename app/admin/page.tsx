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
    <main className="blog-container">
      <div style={{ maxWidth: '360px', margin: '60px auto' }}>
        <div className="post-card">
          <h1 style={{ fontSize: '1.2em', marginBottom: '24px', color: 'var(--text)' }}>
            관리자 로그인
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  fontSize: '0.95em',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            {error && (
              <div style={{ color: '#e06c75', fontSize: '0.85em', marginBottom: '12px' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
