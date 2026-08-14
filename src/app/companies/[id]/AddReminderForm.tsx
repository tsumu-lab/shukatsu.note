"use client";
// 「リマインダーを追加」ボタンを押すまでは入力欄を隠しておく部品

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
      <button onClick={() => setIsAdding(true)} className="text-sm text-blue-600 underline">
        ＋ リマインダーを追加
      </button>
    );
  }

  return (
    <form action={createReminder} className="flex gap-2 items-end flex-wrap">
      <input type="hidden" name="companyId" value={companyId} />
      <div>
        <label className="block text-xs mb-1">タイトル</label>
        <input name="title" required className="border rounded px-2 py-1 text-sm" />
      </div>
      <div>
        <label className="block text-xs mb-1">締切日</label>
        <input name="dueDate" type="datetime-local" className="border rounded px-2 py-1 text-sm" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
        追加
      </button>
      <button type="button" onClick={() => setIsAdding(false)} className="text-sm text-gray-500">
        キャンセル
      </button>
    </form>
  );
}