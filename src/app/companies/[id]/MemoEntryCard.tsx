"use client";

import { useState, useRef, useEffect } from "react";
import PinButton from "@/app/PinButton";
import { togglePinMemoEntry } from "@/app/actions";
import { getClickOffset } from "@/lib/clickToCaret";
import { useEditGuard } from "./EditGuardContext";

type MemoEntry = { id: number; title: string | null; content: string; pinned: boolean };

export default function MemoEntryCard({
  entry,
  companyId,
  updateMemoEntry,
  deleteMemoEntry,
}: {
  entry: MemoEntry;
  companyId: number;
  updateMemoEntry: (formData: FormData) => void;
  deleteMemoEntry: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [caretOffset, setCaretOffset] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLocked, requestSaveHint } = useEditGuard();

    const handleOpen = (e: React.MouseEvent) => {
    if (isLocked()) {
      requestSaveHint();
      return;
    }
    setCaretOffset(getClickOffset(e));
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(caretOffset, caretOffset);
    }
  }, [isEditing]);

  const handleBlur = async (e: React.FocusEvent<HTMLFormElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return; // まだフォーム内(タイトル欄など)なら何もしない
    const value = textareaRef.current?.value.trim();
    if (!value) {
      const fd = new FormData();
      fd.set("id", String(entry.id));
      fd.set("companyId", String(companyId));
      await deleteMemoEntry(fd);
    } else {
      formRef.current?.requestSubmit();
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
        <form ref={formRef} action={updateMemoEntry} onBlur={handleBlur} className="space-y-1">
        <input type="hidden" name="id" value={entry.id} />
        <input type="hidden" name="companyId" value={companyId} />
        <input
          name="title"
          defaultValue={entry.title ?? ""}
          placeholder="タイトル（任意）"
          className="w-full px-1 py-1 text-sm font-medium bg-transparent border-none focus:outline-none"
        />
        <textarea
          ref={textareaRef}
          name="content"
          defaultValue={entry.content}
          rows={3}
          className="w-full rounded p-3 text-sm border-none focus:outline-none"
          style={{ backgroundColor: "var(--color-memo)" }}
        />
      </form>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <button
        onClick={handleOpen}
        className="flex-1 text-left text-sm whitespace-pre-wrap rounded p-3"
        style={{ backgroundColor: "var(--color-memo)" }}
      >
        {entry.title && (
            <>
              <p className="font-medium mb-1">{entry.title}</p>
              <hr style={{ border: "none", borderTop: "1px solid rgba(58,51,43,0.15)", margin: "8px 10px" }} />
            </>
        )}
        
        {entry.content}
      </button>
      <PinButton pinned={entry.pinned} formData={{ id: entry.id, companyId }} action={togglePinMemoEntry} className="pt-3" />
    </div>
  );
}