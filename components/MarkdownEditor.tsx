'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  height?: number;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('이미지 업로드 실패');
  const data = await res.json();
  return data.url as string;
}

export default function MarkdownEditor({ value, onChange, height = 600 }: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const sync = () => {
      setColorMode((document.documentElement.dataset.theme as 'dark' | 'light') || 'dark');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  async function handleImageUpload(file: File) {
    try {
      const url = await uploadImage(file);
      const imageMarkdown = `![image](${url})`;
      onChange(value + '\n' + imageMarkdown + '\n');
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;
    e.preventDefault();
    const file = imageItem.getAsFile();
    if (!file) return;
    await handleImageUpload(file);
  }

  return (
    <div
      data-color-mode={colorMode}
      onPaste={handlePaste}
      style={{
        border: '1px solid var(--border)',
        borderRadius: '4px',
        height: `${height}px`,
        overflow: 'hidden',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleImageUpload(file);
          e.target.value = '';
        }}
      />
      <PanelGroup orientation="horizontal" style={{ height: '100%' }}>
        {/* 에디터 패널 */}
        <Panel defaultSize={50} minSize={20}>
          <div style={{ height: '100%', overflow: 'hidden' }}>
            <MDEditor
              value={value}
              onChange={(val) => onChange(val ?? '')}
              height={height}
              preview="edit"
              style={{ height: '100%' }}
              extraCommands={[
                {
                  name: 'upload-image',
                  keyCommand: 'upload-image',
                  buttonProps: { 'aria-label': '이미지 업로드' },
                  icon: (
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                    </svg>
                  ),
                  execute: () => {
                    fileInputRef.current?.click();
                  },
                },
              ]}
            />
          </div>
        </Panel>

        {/* 드래그 핸들 */}
        <PanelResizeHandle className="md-resize-handle" />

        {/* 미리보기 패널 */}
        <Panel defaultSize={50} minSize={20}>
          <div
            style={{
              height: '100%',
              overflow: 'auto',
              padding: '16px 20px',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: '0.75em',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                letterSpacing: '0.05em',
              }}
            >
              미리보기
            </div>
            <div className="post-content">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {value || '*내용을 입력하면 여기에 미리보기가 표시됩니다.*'}
              </ReactMarkdown>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
