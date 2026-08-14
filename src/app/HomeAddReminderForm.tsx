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
        className="w-full text-left text-sm text-blue-600 border border-dashed rounded-lg p-3 mb-6"
      >
        ＋ リマインダーを追加
      </button>
    );
  }

  return (
    <form
      action={createReminder}
      className="border rounded-lg p-3 mb-6 space-y-2"
    >
      <div className="flex gap-2 flex-wrap">
        <input
          name="title"
          required
          autoFocus
          placeholder="タイトル"
          className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]"
        />
        <input name="dueDate" type="datetime-local" className="border rounded px-2 py-1 text-sm" />
      </div>

      {/* companyIdを空("")のままにすると個人用として保存される */}
      <select name="companyId" className="border rounded px-2 py-1 text-sm w-full">
        <option value="">個人（企業に紐づけない）</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
          追加
        </button>
        <button type="button" onClick={() => setIsAdding(false)} className="text-sm text-gray-500">
          キャンセル
        </button>
      </div>
    </form>
  );
}