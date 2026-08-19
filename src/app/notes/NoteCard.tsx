"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import PinButton from "@/app/PinButton";
import { togglePinNote } from "@/app/actions";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NoteCard({
  note,
  category,
  updateNote,
}: {
  note: Note;
  category: string;
  updateNote: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <form action={updateNote} className="border rounded-lg p-4 space-y-2">
        <input type="hidden" name="id" value={note.id} />
        <input type="hidden" name="category" value={category} />
        <input
          name="title"
          defaultValue={note.title}
          required
          autoFocus
          className="w-full px-1 py-1 font-medium"
        />
        <textarea
          name="content"
          defaultValue={note.content}
          required
          rows={6}
          className="w-full rounded p-3 text-sm bg-gray-100"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
            保存
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-gray-500">
            キャンセル
          </button>
        </div>
      </form>
    );
  }

  return (
    /** 
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-medium">{note.title}</p>
        <button onClick={() => setIsEditing(true)} aria-label="編集" className="text-gray-400 hover:text-blue-600">
          <Pencil size={14} />
        </button>
      </div>
      <p className="text-sm whitespace-pre-wrap bg-gray-100 rounded p-3">{note.content}</p>
    </div>
    */
      <div className="flex justify-between items-center">
        <p className="font-medium">{note.title}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsEditing(true)} aria-label="編集" className="text-gray-400 hover:text-blue-600">
            <Pencil size={14} />
          </button>
          <PinButton pinned={note.pinned} formData={{ id: note.id, category }} action={togglePinNote} />
        </div>
      </div>
  );
}