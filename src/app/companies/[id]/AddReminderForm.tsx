"use client";

import { useState } from "react";

export default function AddReminderForm({
  companyId,
  createReminder,
}: {
  companyId: number;
  createReminder: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full text-left text-sm rounded-xl px-3 py-2"
        style={{ color: "var(--color-accent)" }}
      >
        ＋ リマインダーを追加
      </button>
    );
  }

  return (
    <form action={createReminder} className="flex gap-2 items-end flex-wrap p-2">
      <input type="hidden" name="companyId" value={companyId} />
      <input
        name="title"
        required
        placeholder="タイトル"
        className="rounded px-2 py-1 text-sm border-none focus:outline-none"
        style={{ backgroundColor: "var(--color-paper)" }}
      />
      <input
        name="dueDate"
        type="datetime-local"
        className="rounded px-2 py-1 text-sm border-none focus:outline-none"
        style={{ backgroundColor: "var(--color-paper)" }}
      />
      <button type="submit" className="text-white px-3 py-1 rounded text-sm" style={{ backgroundColor: "var(--color-accent)" }}>
        追加
      </button>
      <button type="button" onClick={() => setIsAdding(false)} className="text-sm" style={{ color: "var(--color-taupe)" }}>
        キャンセル
      </button>
    </form>
  );
}