"use client";

import { useState } from "react";

export default function AddEntrySheetForm({
  companyId,
  addEntrySheet,
}: {
  companyId: number;
  addEntrySheet: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [maxLength, setMaxLength] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className="text-sm text-blue-600 underline">
        ＋ 設問を追加
      </button>
    );
  }

  const isOver = maxLength ? answerText.length > maxLength : false;

  return (
    <form action={addEntrySheet} className="space-y-3">
      <input type="hidden" name="companyId" value={companyId} />
      <div>
        <label className="block text-sm mb-1">設問</label>
        <div className="flex items-center gap-2">
          <input name="question" required autoFocus className="flex-1 border rounded px-3 py-2" />
          <input
            name="maxLength"
            type="number"
            min={1}
            onChange={(e) => setMaxLength(e.target.value ? Number(e.target.value) : null)}
            placeholder="字数"
            className="w-20 border rounded px-2 py-2 text-sm"
          />
          <span className="text-xs text-gray-400 whitespace-nowrap">字以内</span>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">回答</label>
        <div className="relative">
          <textarea
            name="answer"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
            rows={5}
            className="w-full border rounded px-3 pb-6 py-2"
          />
          <span
            className={`absolute bottom-2 right-3 text-xs ${
              isOver ? "text-red-500" : "text-gray-400"
            }`}
          >
            {answerText.length}
            {maxLength ? ` / ${maxLength}` : ""}
          </span>
        </div>
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