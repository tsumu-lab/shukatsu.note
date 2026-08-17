"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useEditGuard } from "./EditGuardContext";

type Interview = {
  id: number;
  question: string;
  answer: string | null;
  memo: string | null;
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
  const { markEditing } = useEditGuard();

  const enterEdit = () => {
    markEditing(`iv-${interview.id}`, true);
    setIsEditing(true);
  };
  const exitEdit = () => {
    markEditing(`iv-${interview.id}`, false);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form action={updateInterview} className="space-y-2">
        <input type="hidden" name="id" value={interview.id} />
        <input type="hidden" name="companyId" value={companyId} />
        <input
          name="question"
          defaultValue={interview.question}
          required
          autoFocus
          placeholder="質問（必須）"
          className="w-full px-1 py-1 font-medium"
        />
        <textarea
          name="answer"
          defaultValue={interview.answer ?? ""}
          rows={4}
          placeholder="回答（任意）"
          className="w-full rounded p-3 text-sm bg-gray-100"
        />
        <textarea
          name="memo"
          defaultValue={interview.memo ?? ""}
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
            formAction={deleteInterview}
            onClick={(e) => {
              if (!confirm("この面接記録を削除しますか？")) e.preventDefault();
              else exitEdit();
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
        <p className="font-medium">{interview.question}</p>
        <button onClick={enterEdit} aria-label="編集" className="text-gray-400 hover:text-blue-600">
          <Pencil size={14} />
        </button>
      </div>
      {interview.answer && (
        <p className="text-sm whitespace-pre-wrap bg-gray-100 rounded p-3">{interview.answer}</p>
      )}
      {interview.memo && (
        <p className="text-sm whitespace-pre-wrap bg-yellow-50 rounded p-3">{interview.memo}</p>
      )}
    </div>
  );
}