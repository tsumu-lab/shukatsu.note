"use client";

import { useState, useRef, useEffect } from "react";
import { getClickOffset } from "@/lib/clickToCaret";

type MemoEntry = { id: number; content: string };

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

  const handleOpen = (e: React.MouseEvent) => {
    setCaretOffset(getClickOffset(e));
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(caretOffset, caretOffset);
    }
  }, [isEditing]);

  const handleBlur = async () => {
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
      <form ref={formRef} action={updateMemoEntry}>
        <input type="hidden" name="id" value={entry.id} />
        <input type="hidden" name="companyId" value={companyId} />
        <textarea
          ref={textareaRef}
          name="content"
          defaultValue={entry.content}
          rows={3}
          onBlur={handleBlur}
          className="w-full rounded p-3 text-sm bg-gray-50 border-none focus:outline-none"
        />
      </form>
    );
  }

  return (
    <button onClick={handleOpen} className="block text-left w-full text-sm whitespace-pre-wrap bg-gray-50 rounded p-3">
      {entry.content}
    </button>
  );
}