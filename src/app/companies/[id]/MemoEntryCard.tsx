"use client";

import { useState, useRef, useEffect } from "react";
import { getClickOffset } from "@/lib/clickToCaret";
import PinButton from "@/app/PinButton";
import { togglePinMemoEntry } from "@/app/actions";

type MemoEntry = { id: number; content: string; pinned: boolean };

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
    <div className="flex items-start gap-2">
      <button
        onClick={handleOpen}
        className="flex-1 text-left text-sm whitespace-pre-wrap rounded p-3"
        style={{ backgroundColor: "var(--color-paper)" }}
      >
        {entry.content}
      </button>
      <PinButton
        pinned={entry.pinned}
        formData={{ id: entry.id, companyId }}
        action={togglePinMemoEntry}
        className="pt-3"
      />
    </div>
  );
}