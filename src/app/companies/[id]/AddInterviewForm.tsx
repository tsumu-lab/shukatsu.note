"use client";

import { useState } from "react";

export default function AddInterviewForm({
  companyId,
  createInterview,
}: {
  companyId: number;
  createInterview: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className="text-sm text-blue-600 underline">
        ＋ 面接記録を追加
      </button>
    );
  }

  return (
    <form action={createInterview} className="space-y-3">
      <input type="hidden" name="companyId" value={companyId} />
      <div>
        <label className="block text-sm mb-1">質問</label>
        <input name="question" required autoFocus className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">回答（任意）</label>
        <textarea name="answer" rows={4} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">メモ（任意）</label>
        <textarea name="memo" rows={2} className="w-full border rounded px-3 py-2" />
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