"use client";

import { useState, useEffect } from "react";
import { useEditGuard } from "./EditGuardContext";
import SaveHint from "./SaveHint";

export default function AddEntrySheetForm({
  companyId,
  addEntrySheet,
}: {
  companyId: number;
  addEntrySheet: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const { markEditing, isLocked, requestSaveHint, hintActive } = useEditGuard();

  useEffect(() => {
    markEditing(`add-es-${companyId}`, isAdding);
    return () => markEditing(`add-es-${companyId}`, false);
  }, [isAdding]);

  if (!isAdding) {
    return (
      <button
        onClick={() => {
          if (isLocked()) requestSaveHint();
          else setIsAdding(true);
        }}
        className="text-sm"
        style={{ color: "var(--color-accent)" }}
      >
        ＋ 設問を追加
      </button>
    );
  }

  return (
    <form action={addEntrySheet} className="space-y-3">
      <input type="hidden" name="companyId" value={companyId} />
      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>設問</label>
        <input name="question" required autoFocus className="w-full rounded px-3 py-2 border-none" style={{ backgroundColor: "var(--color-surface)" }} />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>回答（任意）</label>
        <textarea name="answer" rows={4} className="w-full rounded px-3 py-2 border-none" style={{ backgroundColor: "var(--color-gre)" }} />
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>メモ（任意）</label>
        <textarea name="memo" rows={2} className="w-full rounded px-3 py-2 border-none" style={{ backgroundColor: "var(--color-memo)" }} />
      </div>
      <div className="flex gap-2 relative">
        <SaveHint show={hintActive} />
        <button type="submit" className="text-white px-4 py-2 rounded" style={{ backgroundColor: "var(--color-accent)" }}>
          保存
        </button>
        <button type="button" onClick={() => setIsAdding(false)} className="text-sm" style={{ color: "var(--color-taupe)" }}>
          キャンセル
        </button>
      </div>
    </form>
  );
}