"use client";

import { useState, useRef, useEffect } from "react";
import { getClickOffset } from "@/lib/clickToCaret";
import PinButton from "@/app/PinButton";
import { togglePinInternNote } from "@/app/actions";
import { useEditGuard } from "./EditGuardContext";

type InternNote = { id: number; title: string | null; content: string; pinned: boolean };

export default function InternNoteCard({
  note,
  companyId,
  updateInternNote,
  deleteInternNote,
}: {
  note: InternNote;
  companyId: number;
  updateInternNote: (formData: FormData) => void;
  deleteInternNote: (formData: FormData) => void;
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
      fd.set("id", String(note.id));
      fd.set("companyId", String(companyId));
      await deleteInternNote(fd);
    } else {
      formRef.current?.requestSubmit();
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form ref={formRef} action={updateInternNote} onBlur={handleBlur}>
        <input type="hidden" name="id" value={note.id} />
        <input type="hidden" name="companyId" value={companyId} />
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
          
          //className="w-full rounded p-3 text-sm bg-gray-50 border-none focus:outline-none"
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
        {note.title && (
            <>
            <p className="font-medium mb-1">{note.title}</p>
            <hr style={{ border: "none", borderTop: "1px solid rgba(58,51,43,0.15)", margin: "8px 10px" }} />
            </>
        )}
        {note.content}
      </button>
      <PinButton
        pinned={note.pinned}
        formData={{ id: note.id, companyId }}
        action={togglePinInternNote}
        className="pt-3"
      />
    </div>
  );
}