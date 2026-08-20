"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useEditGuard } from "./EditGuardContext";
import PinButton from "@/app/PinButton";
import { togglePinEntrySheet } from "@/app/actions";
import SaveHint from "./SaveHint";

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
  const [answerText, setAnswerText] = useState(es.answer);
  const { markEditing, isLocked, requestSaveHint, hintActive } = useEditGuard();

  // 編集状態が変わるたび、また消える時(理由を問わず)に必ず記録を更新する
  useEffect(() => {
    markEditing(`es-${es.id}`, isEditing);
    return () => markEditing(`es-${es.id}`, false);
  }, [isEditing, es.id]);

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
            className="flex-1 px-1 py-1 font-medium bg-transparent"
          />
          <input
            name="maxLength"
            type="number"
            min={1}
            defaultValue={es.maxLength ?? ""}
            placeholder="字数"
            className="w-16 rounded px-1 py-1 text-xs border-none"
            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-taupe)" }}
          />
          <span className="text-xs" style={{ color: "var(--color-taupe)" }}>字以内</span>
        </div>

        <div className="relative">
          <textarea
            name="answer"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={4}
            className="w-full rounded p-3 pb-6 text-sm border-none"
            style={{ backgroundColor: "var(--color-gre)" }}
          />
          <span
            className="absolute bottom-2 right-3 text-xs"
            style={{ color: isOver ? "var(--color-rust)" : "var(--color-taupe)" }}
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
          className="w-full rounded p-3 text-sm border-none"
          style={{ backgroundColor: "var(--color-memo)" }}
        />

        <div className="flex items-center gap-2 relative">
          <SaveHint show={hintActive} />
          <button type="submit" className="text-white px-3 py-1 rounded text-sm" style={{ backgroundColor: "var(--color-accent)" }}>
            保存
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm" style={{ color: "var(--color-taupe)" }}>
            キャンセル
          </button>
          <button
            type="submit"
            formAction={deleteEntrySheet}
            onClick={(e) => {
              if (!confirm("この設問を削除しますか？")) e.preventDefault();
            }}
            aria-label="削除"
            style={{ color: "var(--color-taupe)" }}
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
          
        <button
          onClick={() => {
            if (isLocked()) requestSaveHint();
            else setIsEditing(true);
          }}
          aria-label="編集"
          style={{ color: "var(--color-taupe)" }}
        >
          <Pencil size={14} />
        </button>
        <PinButton pinned={es.pinned} formData={{ id: es.id, companyId }} action={togglePinEntrySheet} />
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap rounded p-3" style={{ backgroundColor: "var(--color-gre)" }}>{es.answer}</p>
      {es.memo && (
        <p className="text-sm whitespace-pre-wrap rounded p-3" style={{ backgroundColor: "var(--color-memo)" }}>{es.memo}</p>
      )}
    </div>
  );
}