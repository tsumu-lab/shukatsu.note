"use client";

import { useState } from "react";

type Company = { id: number; name: string };

export default function HomeAddReminderForm({
  companies,
  createReminder,
}: {
  companies: Company[];
  createReminder: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full text-left text-sm rounded-xl px-3 py-2 mt-1"
        style={{ color: "var(--color-accent)" }}
      >
        ＋ リマインダーを追加
      </button>
    );
  }

  return (
    <form action={createReminder} className="rounded-xl p-3 mt-1 space-y-2" style={{ backgroundColor: "var(--color-paper)" }}>
      <div className="flex gap-2 flex-wrap">
        <input
          name="title"
          required
          autoFocus
          placeholder="タイトル"
          className="rounded px-2 py-1 text-sm flex-1 min-w-[120px] border-none focus:outline-none"
          style={{ backgroundColor: "var(--color-surface)" }}
        />
        <input
          name="dueDate"
          type="datetime-local"
          className="rounded px-2 py-1 text-sm border-none focus:outline-none"
          style={{ backgroundColor: "var(--color-surface)" }}
        />
      </div>
      <select
        name="companyId"
        className="rounded px-2 py-1 text-sm w-full border-none focus:outline-none"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <option value="">個人（企業に紐づけない）</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="text-white px-3 py-1 rounded text-sm" style={{ backgroundColor: "var(--color-accent)" }}>
          追加
        </button>
        <button type="button" onClick={() => setIsAdding(false)} className="text-sm" style={{ color: "var(--color-taupe)" }}>
          キャンセル
        </button>
      </div>
    </form>
  );
}