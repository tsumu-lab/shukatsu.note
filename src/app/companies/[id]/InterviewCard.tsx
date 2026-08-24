"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useEditGuard } from "./EditGuardContext";
import PinButton from "@/app/PinButton";
import { togglePinInterview } from "@/app/actions";
import SaveHint from "./SaveHint";

type Interview = {
  id: number;
  question: string;
  answer: string | null;
  memo: string | null;
  pinned: boolean;
};

export default function InterviewCard({
  interview,
  companyId,
  updateInterview,
  deleteInterview,
}: {
  interview: Interview;
  companyId: number;
  updateInterview: (formData: FormData) => void;
  deleteInterview: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { markEditing, isLocked, requestSaveHint, hintActive } = useEditGuard();

  useEffect(() => {
    markEditing(`iv-${interview.id}`, isEditing);
    return () => markEditing(`iv-${interview.id}`, false);
  }, [isEditing, interview.id]);

  if (isEditing) {
    return (
      <form action={updateInterview} className="space-y-2">
        <input type="hidden" name="id" value={interview.id} />
                <SaveHint show={hintActive} />
        <input type="hidden" name="companyId" value={companyId} />
        <input
          name="question"
          defaultValue={interview.question}
          required
          autoFocus
          placeholder="質問（必須）"
          className="w-full px-1 py-1 font-medium bg-transparent"
        />
        <textarea
          name="answer"
          defaultValue={interview.answer ?? ""}
          rows={4}
          placeholder="回答（任意）"
          className="w-full rounded p-3 text-sm border-none"
          style={{ backgroundColor: "var(--color-gre)" }}
        />
        <textarea
          name="memo"
          defaultValue={interview.memo ?? ""}
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
            formAction={deleteInterview}
            onClick={(e) => {
              if (!confirm("この面接記録を削除しますか？")) e.preventDefault();
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
    <div className="rounded-xl p-3" style={{ backgroundColor: "var(--color-item-card)" }}>
      <div className="flex justify-between items-center">
        <p className="font-medium">{interview.question}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          
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
          <PinButton pinned={interview.pinned} formData={{ id: interview.id, companyId }} action={togglePinInterview} />
        </div>
      </div>

      {interview.answer && (
        <>
          <hr style={{ border: "none", borderTop: "1px solid rgba(58,51,43,0.15)", margin: "8px 10px" }} />
          <p className="text-sm whitespace-pre-wrap">{interview.answer}</p>
        </>
      )}

      {interview.memo && (
        <div 
            className="reminder-row company mt-2"
            style={{ backgroundColor: "var(--color-memo)" }}
        >
          <p className="text-sm whitespace-pre-wrap">{interview.memo}</p>
          
        </div>
      )}
    </div>
  );
}