'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('이미지 업로드 실패');
  const data = await res.json();
  return data.url as string;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      data-color-mode="dark"
      onPaste={handlePaste}
      style={{ border: '1px solid var(--border)', borderRadius: '4px' }}
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
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? '')}
        height={480}
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
  );
}
