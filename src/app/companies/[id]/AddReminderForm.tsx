"use client";

import { useState, useEffect } from "react";
import { useEditGuard } from "./EditGuardContext";
import SaveHint from "./SaveHint";

export default function AddReminderForm({
  companyId,
  createReminder,
}: {
  companyId: number;
  createReminder: (formData: FormData) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const { markEditing, isLocked, requestSaveHint, hintActive } = useEditGuard();

  useEffect(() => {
    markEditing(`add-reminder-${companyId}`, isAdding);
    return () => markEditing(`add-reminder-${companyId}`, false);
  }, [isAdding]);

  if (!isAdding) {
    return (
      <button
        onClick={() => {
          if (isLocked()) requestSaveHint();
          else setIsAdding(true);
        }}
        className="w-full text-left text-sm rounded-xl px-3 py-2"
        style={{ color: "var(--color-accent)" }}
      >
        ＋ リマインダーを追加
      </button>
    );
  }

  return (
    <form action={createReminder} className="p-2">
      
      <div className="flex gap-2 items-end flex-wrap relative">
        <SaveHint show={hintActive} />
        <input type="hidden" name="companyId" value={companyId} />
        <input
          name="title"
          required
          autoFocus
          placeholder="タイトル"
          className="rounded px-2 py-1 text-sm border-none focus:outline-none"
          style={{ backgroundColor: "var(--color-company-tint)" }}
        />
        <input
          name="dueDate"
          type="datetime-local"
          className="rounded px-2 py-1 text-sm border-none focus:outline-none"
          style={{ backgroundColor: "var(--color-company-tint)" }}
        />
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