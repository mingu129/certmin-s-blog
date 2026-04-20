'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import ThumbnailUploader from '@/components/ThumbnailUploader';

export default function AdminEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/posts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '');
        setContent(data.content || '');
        setTags(data.tags || []);
        setThumbnail(data.thumbnail || '');
        setFetching(false);
      })
      .catch(() => {
        setError('글을 불러오는데 실패했습니다.');
        setFetching(false);
      });
  }, [slug]);

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#+/, '').trim();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput('');
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('제목을 입력하세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, thumbnail: thumbnail || null }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (res.ok) {
        router.push(`/blog/${slug}`);
      } else {
        setError(data.error || '저장 실패');
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('요청 시간 초과.');
      } else {
        setError(`오류: ${err instanceof Error ? err.message : String(err)}`);
      }
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 72px)', gap: '10px', color: 'var(--text-muted)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--accent)' }}>hourglass_empty</span>
        불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0 32px' }}>
      {/* Sticky top bar */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--glass-nav-bg)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 0', gap: '16px',
        }}
      >
        <Link href="/admin/write" className="btn">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          목록
        </Link>
        {error && (
          <span style={{ color: 'var(--error)', fontSize: '0.82em', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
            {error}
          </span>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 24px', background: 'var(--accent)', color: '#000',
            border: 'none', borderRadius: '0.5rem', fontSize: '0.82em',
            fontWeight: 700, fontFamily: 'inherit', letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px var(--accent-soft-hover)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
          {loading ? '저장 중...' : '수정 완료'}
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '40px 0 16px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: '100%', background: 'transparent', border: 'none',
            borderBottom: '2px solid var(--border)', color: 'var(--text)',
            fontSize: '2.5em', fontFamily: 'inherit', fontWeight: 800,
            letterSpacing: '-0.04em', padding: '8px 0', outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderBottomColor = 'var(--accent)'; }}
          onBlur={(e) => { e.target.style.borderBottomColor = 'var(--border)'; }}
        />
      </div>

      {/* Tags + Thumbnail row */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Tags */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
            태그
          </div>
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px',
              background: 'var(--surface-high)', borderRadius: '0.5rem', padding: '8px 12px',
              minHeight: '44px', cursor: 'text',
            }}
            onClick={() => document.getElementById('tag-input-edit')?.focus()}
          >
            {tags.map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
                <button
                  onClick={(e) => { e.stopPropagation(); setTags((p) => p.filter((t) => t !== tag)); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 0 0 4px', lineHeight: 1, fontSize: '14px' }}
                >×</button>
              </span>
            ))}
            <input
              id="tag-input-edit"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
              placeholder={tags.length === 0 ? '태그 입력 후 Enter' : ''}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: '0.85em', fontFamily: 'inherit',
                flex: 1, minWidth: '120px',
              }}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
            썸네일
          </div>
          <ThumbnailUploader
            value={thumbnail}
            onChange={setThumbnail}
            onError={(msg) => setError(msg)}
          />
        </div>
      </div>

      {/* Editor */}
      <div style={{ paddingBottom: '64px' }}>
        <MarkdownEditor value={content} onChange={setContent} height={680} />
      </div>
    </div>
  );
}
