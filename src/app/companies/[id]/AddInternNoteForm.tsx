"use client";

import { useState, useRef } from "react";

export default function AddInternNoteForm({
  companyId,
  createInternNote,
}: {
  companyId: number;
  createInternNote: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleBlur = () => {
    formRef.current?.requestSubmit();
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className="text-sm text-blue-600 underline">
        ＋ メモを追加
      </button>
    );
  }

  return (
    <form ref={formRef} action={createInternNote}>
      <input type="hidden" name="companyId" value={companyId} />
      <textarea
        name="content"
        rows={3}
        autoFocus
        onBlur={handleBlur}
        placeholder="メモを書く..."
        className="w-full rounded p-3 text-sm bg-gray-50 border-none focus:outline-none"
      />
    </form>
  );
}