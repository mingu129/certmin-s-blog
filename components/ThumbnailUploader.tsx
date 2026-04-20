'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Props {
  value: string;
  onChange: (url: string) => void;
  onError?: (msg: string) => void;
}

const actionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 14px',
  background: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '0.4rem',
  color: '#fff',
  fontSize: '0.78em',
  fontFamily: 'inherit',
  cursor: 'pointer',
  fontWeight: 600,
  letterSpacing: '0.04em',
};

export default function ThumbnailUploader({ value, onChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);
  const [modal, setModal] = useState<{
    localUrl: string;
    serverUrl: string | null;
    uploading: boolean;
  } | null>(null);

  async function handleFile(file: File) {
    const localUrl = URL.createObjectURL(file);
    setModal({ localUrl, serverUrl: null, uploading: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setModal((prev) => (prev ? { ...prev, serverUrl: data.url, uploading: false } : null));
      } else {
        URL.revokeObjectURL(localUrl);
        setModal(null);
        onError?.('썸네일 업로드 실패');
      }
    } catch {
      URL.revokeObjectURL(localUrl);
      setModal(null);
      onError?.('썸네일 업로드 실패');
    }
  }

  function confirmModal() {
    if (!modal || modal.uploading || !modal.serverUrl) return;
    onChange(modal.serverUrl);
    URL.revokeObjectURL(modal.localUrl);
    setModal(null);
  }

  function closeModal() {
    if (modal) URL.revokeObjectURL(modal.localUrl);
    setModal(null);
  }

  function reselect() {
    closeModal();
    setTimeout(() => inputRef.current?.click(), 50);
  }

  return (
    <>
      {/* Crop preview modal */}
      {modal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '0.75rem',
              padding: '28px',
              width: '100%',
              maxWidth: '640px',
            }}
          >
            {/* Modal header */}
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.05em', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                썸네일 크롭 미리보기
              </h3>
              <p style={{ fontSize: '0.8em', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                이미지 중앙을 기준으로 <strong style={{ color: 'var(--text)' }}>16:9</strong> 비율로 크롭됩니다. 실제 표시 영역을 확인하세요.
              </p>
            </div>

            {/* 16:9 preview box */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                background: 'var(--surface-highest)',
                marginBottom: '10px',
              }}
            >
              <Image
                src={modal.localUrl}
                alt="썸네일 미리보기"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
              {modal.uploading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#fff',
                    fontSize: '0.85em',
                    fontWeight: 600,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '20px', animation: 'thumb-spin 1s linear infinite' }}
                  >
                    progress_activity
                  </span>
                  서버에 업로드 중...
                </div>
              )}
            </div>

            {/* Label */}
            <div style={{ fontSize: '0.72em', color: 'var(--text-muted)', marginBottom: '18px', letterSpacing: '0.05em' }}>
              ↑ 실제 글 목록 및 상세 페이지에 표시되는 영역
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={confirmModal}
                disabled={modal.uploading}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  background: modal.uploading ? 'var(--surface-high)' : 'var(--accent)',
                  color: modal.uploading ? 'var(--text-muted)' : '#000',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: '0.82em',
                  cursor: modal.uploading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'filter 0.15s',
                }}
              >
                {modal.uploading ? '업로드 중...' : '이 이미지 사용'}
              </button>
              <button
                onClick={reselect}
                style={{
                  padding: '11px 18px',
                  background: 'var(--surface-high)',
                  color: 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontFamily: 'inherit',
                  fontSize: '0.82em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                다시 선택
              </button>
              <button
                onClick={closeModal}
                style={{
                  padding: '11px 14px',
                  background: 'none',
                  color: 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontFamily: 'inherit',
                  fontSize: '0.82em',
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />

      {value ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Image src={value} alt="thumbnail" fill style={{ objectFit: 'cover' }} unoptimized />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: hovering ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            <button onClick={() => inputRef.current?.click()} style={actionBtnStyle}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>photo_camera</span>
              변경
            </button>
            <button onClick={() => onChange('')} style={{ ...actionBtnStyle, borderColor: 'rgba(249,115,134,0.4)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
              제거
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            aspectRatio: '16/9',
            background: 'var(--surface-high)',
            border: '1px dashed var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.82em',
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-highest)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface-high)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--text-muted)' }}>
            add_photo_alternate
          </span>
          <span>썸네일 이미지 업로드</span>
          <span style={{ fontSize: '0.75em', opacity: 0.6 }}>16:9 비율로 크롭됩니다</span>
        </button>
      )}

      <style>{`
        @keyframes thumb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
