"use client";

import { useState } from "react";

export default function AddNoteForm({
  category,
  createNote,
}: {
  category: string;
  createNote: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className="text-sm " style={{ color: "var(--color-accent)" }}>
        ＋ メモを追加
      </button>
    );
  }

  return (
    <form action={createNote} className="border rounded-lg p-4 space-y-3">
      <input type="hidden" name="category" value={category} />
      <div>
        <label className="block text-sm mb-1">タイトル</label>
        <input name="title" required autoFocus className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">本文</label>
        <textarea name="content" required rows={6} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          保存
        </button>
        <button type="button" onClick={() => setIsAdding(false)} className="text-sm text-gray-500">
          キャンセル
        </button>
      </div>
    </form>
  );
}