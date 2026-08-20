"use client";

import { useState, useRef } from "react";
import PinButton from "@/app/PinButton";
import { togglePinNote } from "@/app/actions";
import { useEditGuard } from "@/app/companies/[id]/EditGuardContext";

type Note = { id: number; title: string | null; content: string; pinned: boolean };

export default function PersonalMemoCard({
  note,
  updatePersonalMemo,
  deletePersonalMemo,
}: {
  note: Note;
  updatePersonalMemo: (formData: FormData) => void;
  deletePersonalMemo: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLocked, requestSaveHint } = useEditGuard();

  const handleBlur = async (e: React.FocusEvent<HTMLFormElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return; // まだフォーム内(タイトル欄など)なら何もしない
    const value = textareaRef.current?.value.trim();
    if (!value) {
      const fd = new FormData();
      fd.set("id", String(note.id));
      await deletePersonalMemo(fd);
    } else {
      formRef.current?.requestSubmit();
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form ref={formRef} action={updatePersonalMemo} onBlur={handleBlur}>
        <input type="hidden" name="id" value={note.id} />
        <input
          name="title"
          defaultValue={note.title ?? ""}
          placeholder="タイトル（任意）"
          className="w-full px-1 py-1 text-sm font-medium bg-transparent border-none focus:outline-none"
        />
        <textarea
          ref={textareaRef}
          name="content"
          defaultValue={note.content}
          rows={3}
          autoFocus
          
          className="w-full rounded p-3 text-sm border-none focus:outline-none"
          style={{ backgroundColor: "var(--color-memo)" }}
        />
      </form>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <button
        onClick={() => {
          if (isLocked()) {
            requestSaveHint();
            return;
          }
          setIsEditing(true);
        }}

        className="flex-1 text-left text-sm whitespace-pre-wrap rounded p-3"
        style={{ backgroundColor: "var(--color-memo)" }}
      >
        {note.title && <p className="font-medium mb-1">{note.title}</p>}
        {note.content}
      </button>
      <PinButton
        pinned={note.pinned}
        formData={{ id: note.id, category: "memo" }}
        action={togglePinNote}
        className="pt-3"
      />
    </div>
  );
}