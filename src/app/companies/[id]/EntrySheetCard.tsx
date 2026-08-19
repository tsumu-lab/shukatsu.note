"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useEditGuard } from "./EditGuardContext";
import PinButton from "@/app/PinButton";
import { togglePinEntrySheet } from "@/app/actions";

type EntrySheet = {
  id: number;
  question: string;
  answer: string;
  memo: string | null;
  maxLength: number | null;
  pinned: boolean;
};

export default function EntrySheetCard({
  es,
  companyId,
  updateEntrySheet,
  deleteEntrySheet,
}: {
  es: EntrySheet;
  companyId: number;
  updateEntrySheet: (formData: FormData) => void;
  deleteEntrySheet: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const { markEditing } = useEditGuard();

  const enterEdit = () => {
    markEditing(`es-${es.id}`, true);
    setIsEditing(true);
  };
  const exitEdit = () => {
    markEditing(`es-${es.id}`, false);
    setIsEditing(false);
  };

  const [answerText, setAnswerText] = useState(es.answer); // 文字数カウント用

  if (isEditing) {
    const isOver = es.maxLength ? answerText.length > es.maxLength : false;

    return (
      <form action={updateEntrySheet} className="space-y-2">
        <input type="hidden" name="id" value={es.id} />
        <input type="hidden" name="companyId" value={companyId} />

        <div className="flex items-center gap-2">
          <input
            name="question"
            defaultValue={es.question}
            required
            autoFocus
            className="flex-1 px-1 py-1 font-medium"
          />
          <input
            name="maxLength"
            type="number"
            min={1}
            defaultValue={es.maxLength ?? ""}
            placeholder="字数"
            className="w-16 border rounded px-1 py-1 text-xs text-gray-500"
          />
          <span className="text-xs text-gray-400">字以内</span>
        </div>

        <div className="relative">
          <textarea
            name="answer"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={6}
            className="w-full rounded p-3 pb-6 text-sm bg-gray-100"
          />
          <span
            className={`absolute bottom-2 right-3 text-xs ${
              isOver ? "text-red-500" : "text-gray-400"
            }`}
          >
            {answerText.length}
            {es.maxLength ? ` / ${es.maxLength}` : ""}
          </span>
        </div>

        <textarea
          name="memo"
          defaultValue={es.memo ?? ""}
          rows={2}
          placeholder="メモ（任意）"
          className="w-full rounded p-3 text-sm bg-yellow-50"
        />

        <div className="flex items-center gap-2">
          <button type="submit" onClick={exitEdit} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
            保存
          </button>
          <button type="button" onClick={exitEdit} className="text-sm text-gray-500">
            キャンセル
          </button>
            <button
            type="submit"
            formAction={deleteEntrySheet}
            onClick={(e) => {
              if (!confirm("この設問を削除しますか？")) e.preventDefault();
            }}
            aria-label="削除"
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-2">
            <div className="flex justify-between items-center">
        <p className="font-medium">
          {es.question}
          {es.maxLength && (
            <span className="text-xs font-normal ml-2" style={{ color: "var(--color-taupe)" }}>
              ({es.maxLength}字以内)
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={enterEdit} aria-label="編集" className="text-gray-400 hover:text-blue-600">
            <Pencil size={14} />
          </button>
          <PinButton pinned={es.pinned} formData={{ id: es.id, companyId }} action={togglePinEntrySheet} />
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap bg-gray-100 rounded p-3">{es.answer}</p>
      {es.memo && (
        <p className="text-sm whitespace-pre-wrap bg-yellow-50 rounded p-3">{es.memo}</p>
      )}
    </div>
  );
}