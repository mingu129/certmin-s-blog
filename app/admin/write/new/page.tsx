'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import ThumbnailUploader from '@/components/ThumbnailUploader';

type DraftData = { title: string; content: string; tags: string[]; thumbnail: string; savedAt: string };

export default function AdminWriteNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Draft
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [draftMsg, setDraftMsg] = useState('');
  const [savingDraft, setSavingDraft] = useState(false);

  // Orphan image tracking
  const uploadedUrlsRef = useRef<string[]>([]);
  const savedRef = useRef(false); // true when post was published

  // Load draft on mount
  useEffect(() => {
    fetch('/api/admin/draft').then(r => r.json()).then(({ draft }) => {
      if (draft) setDraft(draft);
    }).catch(() => {});
  }, []);

  function loadDraft() {
    if (!draft) return;
    setTitle(draft.title);
    setContent(draft.content);
    setTags(draft.tags ?? []);
    setThumbnail(draft.thumbnail ?? '');
    setDraft(null);
  }

  function dismissDraft() {
    setDraft(null);
    fetch('/api/admin/draft', { method: 'DELETE' }).catch(() => {});
  }

  async function handleSaveDraft() {
    setSavingDraft(true);
    setDraftMsg('');
    try {
      const res = await fetch('/api/admin/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, thumbnail: thumbnail || null }),
      });
      const data = await res.json();
      if (res.ok) {
        const time = new Date(data.savedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        setDraftMsg(`${time} 저장됨`);
        setTimeout(() => setDraftMsg(''), 3000);
      }
    } catch { /* ignore */ }
    finally { setSavingDraft(false); }
  }

  // Cleanup orphaned images on back (without save)
  const cleanupOrphanImages = useCallback(async () => {
    const urls = uploadedUrlsRef.current;
    if (urls.length === 0 || savedRef.current) return;
    // Fire-and-forget (best effort)
    navigator.sendBeacon
      ? navigator.sendBeacon('/api/admin/upload', new Blob([JSON.stringify({ urls })], { type: 'application/json' }))
      : fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ urls }), keepalive: true }).catch(() => {});
  }, []);

  // Back button
  async function handleBack() {
    await cleanupOrphanImages();
    router.push('/admin/write');
  }

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#+/, '').trim();
    if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
    setTagInput('');
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
    else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) setTags(prev => prev.slice(0, -1));
  }

  async function handlePublish() {
    if (!title.trim()) { setError('제목을 입력하세요.'); return; }
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, thumbnail: thumbnail || null }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (res.ok) {
        savedRef.current = true;
        // Clear draft on publish
        fetch('/api/admin/draft', { method: 'DELETE' }).catch(() => {});
        router.push(`/blog/${data.slug}`);
      } else {
        setError(data.error || '저장 실패');
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') setError('요청 시간 초과.');
      else setError(`오류: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  }

  // Ctrl+S → save draft
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSaveDraft(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags, thumbnail]);

  return (
    <div style={{ minHeight: '100vh', padding: '0 32px' }}>
      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--glass-nav-bg)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', gap: '12px',
      }}>
        <button onClick={handleBack} className="btn" type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          뒤로
        </button>

        {error && (
          <span style={{ color: 'var(--error)', fontSize: '0.82em', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
            {error}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          {draftMsg && (
            <span style={{ fontSize: '0.75em', color: 'var(--text-muted)' }}>{draftMsg}</span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={savingDraft}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '8px 16px', background: 'var(--surface-high)',
              color: 'var(--text)', border: '1px solid var(--border)',
              borderRadius: '0.5rem', fontSize: '0.78em', fontWeight: 600,
              fontFamily: 'inherit', letterSpacing: '0.06em', cursor: 'pointer',
              opacity: savingDraft ? 0.6 : 1,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>save</span>
            임시저장
          </button>
          <button
            onClick={handlePublish}
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
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>publish</span>
            {loading ? '저장 중...' : '글 발행'}
          </button>
        </div>
      </div>

      {/* Draft restore banner */}
      {draft && (
        <div style={{
          margin: '16px 0 0',
          padding: '12px 16px',
          background: 'var(--primary-container)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: '0.85em',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>history</span>
          <span style={{ flex: 1, color: 'var(--secondary-container-text)' }}>
            임시저장된 글이 있습니다 ({new Date(draft.savedAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})
          </span>
          <button type="button" onClick={loadDraft} style={{ padding: '4px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em', fontFamily: 'inherit', fontWeight: 600 }}>
            불러오기
          </button>
          <button type="button" onClick={dismissDraft} style={{ padding: '4px 10px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85em', fontFamily: 'inherit' }}>
            무시
          </button>
        </div>
      )}

      {/* Title */}
      <div style={{ padding: '32px 0 16px' }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: '100%', background: 'transparent', border: 'none',
            borderBottom: '2px solid var(--border)', color: 'var(--text)',
            fontSize: '2.5em', fontFamily: 'inherit', fontWeight: 800,
            letterSpacing: '-0.04em', padding: '8px 0', outline: 'none',
          }}
          onFocus={e => { e.target.style.borderBottomColor = 'var(--accent)'; }}
          onBlur={e => { e.target.style.borderBottomColor = 'var(--border)'; }}
        />
      </div>

      {/* Tags + Thumbnail */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>태그</div>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', background: 'var(--surface-high)', borderRadius: '0.5rem', padding: '8px 12px', minHeight: '44px', cursor: 'text' }}
            onClick={() => document.getElementById('tag-input')?.focus()}
          >
            {tags.map(tag => (
              <span key={tag} className="tag-chip">
                #{tag}
                <button onClick={e => { e.stopPropagation(); setTags(p => p.filter(t => t !== tag)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 0 0 4px', lineHeight: 1, fontSize: '14px' }}>×</button>
              </span>
            ))}
            <input
              id="tag-input"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
              placeholder={tags.length === 0 ? '태그 입력 후 Enter' : ''}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '0.85em', fontFamily: 'inherit', flex: 1, minWidth: '120px' }}
            />
          </div>
        </div>
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>썸네일</div>
          <ThumbnailUploader value={thumbnail} onChange={setThumbnail} onError={msg => setError(msg)} />
        </div>
      </div>

      {/* Editor */}
      <div style={{ paddingBottom: '64px' }}>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          height={680}
          onImageUploaded={url => { uploadedUrlsRef.current = [...uploadedUrlsRef.current, url]; }}
        />
        <p style={{ fontSize: '0.72em', color: 'var(--text-muted)', marginTop: '8px' }}>
          Ctrl+S 로 임시저장
        </p>
      </div>
    </div>
  );
}
