"use client";

import { useState, useRef, useEffect } from "react";
import { getClickOffset } from "@/lib/clickToCaret";
import PinButton from "@/app/PinButton";
import { togglePinInternNote } from "@/app/actions";

type InternNote = { id: number; content: string; pinned: boolean };

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
      <form ref={formRef} action={updateInternNote}>
        <input type="hidden" name="id" value={note.id} />
        <input type="hidden" name="companyId" value={companyId} />
        <textarea
          ref={textareaRef}
          name="content"
          defaultValue={note.content}
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