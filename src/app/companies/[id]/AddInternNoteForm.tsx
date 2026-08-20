"use client";

import { useState, useRef } from "react";
import { useEditGuard } from "./EditGuardContext";

export default function AddInternNoteForm({
  companyId,
  createInternNote,
}: {
  companyId: number;
  createInternNote: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { isLocked, requestSaveHint } = useEditGuard();

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    formRef.current?.requestSubmit(); // 空ならaction側で無視される
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => {
          if (isLocked()) {
            requestSaveHint();
            return;
          }
          setIsAdding(true);
        }}
        className="text-sm text-blue-600 underline"
      >
        ＋ メモを追加
      </button>
    );
  }

  return (
    <form ref={formRef} action={createInternNote} onBlur={handleBlur}>
      <input type="hidden" name="companyId" value={companyId} />
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
        className="w-full rounded p-3 text-sm bg-gray-50 border-none focus:outline-none"
        style={{ backgroundColor: "var(--color-memo)" }}
      />
    </form>
  );
}