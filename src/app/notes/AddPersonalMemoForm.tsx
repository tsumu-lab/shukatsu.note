"use client";

import { useState, useRef } from "react";

export default function AddPersonalMemoForm({
  createPersonalMemo,
}: {
  createPersonalMemo: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    formRef.current?.requestSubmit(); // 空ならaction側で無視される
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className="text-sm" style={{ color: "var(--color-accent)" }}>
        ＋ メモを追加
      </button>
    );
  }

  return (
    <form ref={formRef} action={createPersonalMemo} onBlur={handleBlur}>
      <input
        name="title"
        placeholder="タイトル（任意）"
        className="w-full px-1 py-1 text-sm font-medium bg-transparent border-none focus:outline-none mb-1"
      />
      <textarea
        name="content"
        rows={3}
        autoFocus
        
        placeholder="メモを書く..."
        className="w-full rounded p-3 text-sm border-none focus:outline-none"
        style={{ backgroundColor: "var(--color-surface)" }}
      />
    </form>
  );
}