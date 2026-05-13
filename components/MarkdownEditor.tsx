'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import CodeBlock from '@/app/components/CodeBlock';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  height?: number;
  onImageUploaded?: (url: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('이미지 업로드 실패');
  const data = await res.json();
  return data.url as string;
}

const BTN: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 34, height: 34, padding: '0 8px',
  background: 'transparent', border: '1px solid transparent',
  borderRadius: 6, color: 'var(--text)', fontSize: '0.82em',
  fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer',
  letterSpacing: 0, lineHeight: 1, transition: 'background 0.1s, border-color 0.1s',
};

type ToolBtn = { label: string; title: string; type: 'wrap' | 'line' | 'block'; prefix: string; suffix?: string; placeholder?: string };
type Divider = { type: 'divider' };
type Item = ToolBtn | Divider;

const TOOLS: Item[] = [
  { type: 'line',  label: 'H1',  title: '제목 1',     prefix: '# ' },
  { type: 'line',  label: 'H2',  title: '제목 2',     prefix: '## ' },
  { type: 'line',  label: 'H3',  title: '제목 3',     prefix: '### ' },
  { type: 'divider' },
  { type: 'wrap',  label: 'B',   title: '굵게',       prefix: '**', suffix: '**', placeholder: '굵은 텍스트' },
  { type: 'wrap',  label: 'I',   title: '기울임',     prefix: '*',  suffix: '*',  placeholder: '기울임 텍스트' },
  { type: 'wrap',  label: 'S',   title: '취소선',     prefix: '~~', suffix: '~~', placeholder: '취소선 텍스트' },
  { type: 'divider' },
  { type: 'wrap',  label: '`  `', title: '인라인 코드', prefix: '`',  suffix: '`',  placeholder: 'code' },
  { type: 'block', label: '```', title: '코드 블록',  prefix: '```\n', suffix: '\n```', placeholder: '코드를 입력하세요' },
  { type: 'divider' },
  { type: 'line',  label: '>',   title: '인용',       prefix: '> ' },
  { type: 'line',  label: '—',   title: '구분선',     prefix: '---' },
  { type: 'divider' },
  { type: 'line',  label: '•',   title: '순서 없는 목록', prefix: '- ' },
  { type: 'line',  label: '1.',  title: '순서 있는 목록', prefix: '1. ' },
  { type: 'divider' },
  { type: 'wrap',  label: '🔗', title: '링크',       prefix: '[', suffix: '](url)', placeholder: '링크 텍스트' },
];

const TOOLBAR_H = 50;

export default function MarkdownEditor({ value, onChange, height = 600, onImageUploaded }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorWrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);
  const [uploading, setUploading] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  // Image upload
  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onImageUploaded?.(url);
      const ta = textareaRef.current;
      const pos = ta ? ta.selectionStart : valueRef.current.length;
      const v = valueRef.current;
      const inserted = `\n![image](${url})\n`;
      onChange(v.substring(0, pos) + inserted + v.substring(pos));
      requestAnimationFrame(() => {
        if (ta) { ta.focus(); ta.setSelectionRange(pos + inserted.length, pos + inserted.length); }
      });
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  // Native paste
  useEffect(() => {
    const el = editorWrapRef.current;
    if (!el) return;
    const handler = async (e: ClipboardEvent) => {
      const imageItem = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'));
      if (!imageItem) return;
      e.preventDefault();
      e.stopPropagation();
      const file = imageItem.getAsFile();
      if (file) await handleImageUpload(file);
    };
    el.addEventListener('paste', handler);
    return () => el.removeEventListener('paste', handler);
  }, [handleImageUpload]);

  // Scroll sync
  useEffect(() => {
    const ta = textareaRef.current;
    const preview = previewRef.current;
    if (!ta || !preview) return;

    const syncTaToPreview = () => {
      if (isSyncing.current) return;
      isSyncing.current = true;
      const pct = ta.scrollTop / Math.max(1, ta.scrollHeight - ta.clientHeight);
      preview.scrollTop = pct * Math.max(0, preview.scrollHeight - preview.clientHeight);
      requestAnimationFrame(() => { isSyncing.current = false; });
    };
    const syncPreviewToTa = () => {
      if (isSyncing.current) return;
      isSyncing.current = true;
      const pct = preview.scrollTop / Math.max(1, preview.scrollHeight - preview.clientHeight);
      ta.scrollTop = pct * Math.max(0, ta.scrollHeight - ta.clientHeight);
      requestAnimationFrame(() => { isSyncing.current = false; });
    };

    ta.addEventListener('scroll', syncTaToPreview);
    preview.addEventListener('scroll', syncPreviewToTa);
    return () => {
      ta.removeEventListener('scroll', syncTaToPreview);
      preview.removeEventListener('scroll', syncPreviewToTa);
    };
  }, []);

  // Tab key → insert 2 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => ta.setSelectionRange(start + 2, start + 2));
    }
  };

  function applyWrap(prefix: string, suffix = '', placeholder = 'text') {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.substring(start, end) || placeholder;
    const newVal = value.substring(0, start) + prefix + sel + suffix + value.substring(end);
    onChange(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + sel.length);
    });
  }

  function applyLine(prefix: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newVal = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    });
  }

  function applyBlock(prefix: string, suffix: string, placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.substring(start, end) || placeholder;
    const ins = '\n' + prefix + sel + suffix + '\n';
    const newVal = value.substring(0, start) + ins + value.substring(end);
    onChange(newVal);
    const selStart = start + prefix.length + 1;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selStart, selStart + sel.length);
    });
  }

  function handleToolBtn(item: ToolBtn) {
    if (item.type === 'wrap')  applyWrap(item.prefix, item.suffix ?? '', item.placeholder ?? 'text');
    if (item.type === 'line')  applyLine(item.prefix);
    if (item.type === 'block') applyBlock(item.prefix, item.suffix ?? '', item.placeholder ?? 'text');
  }

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
    if (!file) return;
    e.preventDefault();
    await handleImageUpload(file);
  }, [handleImageUpload]);

  const innerH = height - TOOLBAR_H;

  return (
    <div
      ref={editorWrapRef}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      style={{ border: '1px solid var(--border)', borderRadius: '8px', height: `${height}px`, overflow: 'hidden', position: 'relative' }}
    >
      {uploading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '0.9em', letterSpacing: '0.05em', borderRadius: '8px',
        }}>
          이미지 업로드 중...
        </div>
      )}

      {/* ===== Toolbar ===== */}
      <div style={{
        height: `${TOOLBAR_H}px`, display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: '2px', flexWrap: 'nowrap',
        background: 'var(--surface-high)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        {TOOLS.map((item, i) => {
          if (item.type === 'divider') {
            return <div key={i} style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />;
          }
          const isH = item.label.startsWith('H');
          const isB = item.label === 'B';
          const isI = item.label === 'I';
          const isS = item.label === 'S';
          return (
            <button
              key={i}
              type="button"
              title={item.title}
              onMouseDown={e => { e.preventDefault(); handleToolBtn(item); }}
              style={{
                ...BTN,
                fontStyle: isI ? 'italic' : 'normal',
                textDecoration: isS ? 'line-through' : 'none',
                fontWeight: isH || isB ? 700 : 500,
                fontSize: isH ? '0.78em' : '0.88em',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-highest)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
              }}
            >
              {item.label}
            </button>
          );
        })}

        {/* Divider before image */}
        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />

        {/* Image upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async e => {
            const file = e.target.files?.[0];
            if (file) await handleImageUpload(file);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          title="이미지 업로드"
          onMouseDown={e => { e.preventDefault(); fileInputRef.current?.click(); }}
          style={{
            ...BTN,
            gap: 5, padding: '0 10px', flexShrink: 0,
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-ring)',
            color: 'var(--primary)',
          }}
        >
          <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
          </svg>
          이미지
        </button>

        <span style={{ marginLeft: 8, fontSize: '0.7em', color: 'var(--text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          붙여넣기 · 드래그
        </span>
      </div>

      {/* ===== Editor + Preview panels ===== */}
      <PanelGroup orientation="horizontal" style={{ height: `${innerH}px` }}>
        <Panel defaultSize={50} minSize={20}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder="마크다운으로 작성하세요..."
            style={{
              width: '100%', height: '100%',
              padding: '20px 24px',
              background: 'var(--surface)',
              color: 'var(--text)',
              border: 'none', outline: 'none', resize: 'none',
              fontFamily: "'Courier New', 'Consolas', monospace",
              fontSize: '0.9em',
              lineHeight: 1.75,
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}
          />
        </Panel>

        <PanelResizeHandle className="md-resize-handle" />

        <Panel defaultSize={50} minSize={20}>
          <div
            ref={previewRef}
            style={{
              height: '100%', overflow: 'auto',
              padding: '20px 24px',
              background: 'var(--surface-container)',
              borderLeft: '1px solid var(--border)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '0.7em', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
              미리보기
            </div>
            <div className="post-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} urlTransform={(url) => url} components={{ pre: ({ children }) => <CodeBlock>{children}</CodeBlock> }}>
                {value.replace(/<!--[\s\S]*?-->/g, '') || '*내용을 입력하면 여기에 미리보기가 표시됩니다.*'}
              </ReactMarkdown>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
