"use client";

import { useState, useRef } from "react";
import { useEditGuard } from "./EditGuardContext";

export default function AddMemoEntryForm({
  companyId,
  createMemoEntry,
}: {
  companyId: number;
  createMemoEntry: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const { isLocked, requestSaveHint } = useEditGuard();

  const formRef = useRef<HTMLFormElement>(null);

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
        className="text-sm "
        style={{ color: "var(--color-accent)" }}
      >
        ＋ メモを追加
      </button>
    );
  }

  return (
    <form ref={formRef} action={createMemoEntry} onBlur={handleBlur}>
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