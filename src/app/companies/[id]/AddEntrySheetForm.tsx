"use client";
// 「設問を追加」ボタンを押すまでは、入力欄を表示しない部品

import { useState } from "react";

export default function AddEntrySheetForm({
  companyId,
  addEntrySheet,
}: {
  companyId: number;
  addEntrySheet: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);

  // 通常時：ボタンだけ表示
  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className="text-sm text-blue-600 underline">
        ＋ 設問を追加
      </button>
    );
  }

  // ボタンを押した後：入力フォームを表示
  return (
    <form action={addEntrySheet} className="space-y-3">
      <input type="hidden" name="companyId" value={companyId} />
      <div>
        <label className="block text-sm mb-1">設問</label>
        <input name="question" required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">回答</label>
        <textarea name="answer" required rows={5} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        {/* ★追加：メモ欄（任意） */}
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