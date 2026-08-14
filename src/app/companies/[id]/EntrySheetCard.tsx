"use client"; // ここから下はブラウザ側で動くコンポーネント（クリックで状態を切り替えるため）

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

type EntrySheet = {
  id: number;
  question: string;
  answer: string;
  memo: string | null; // ★追加
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
  // true: 編集フォーム表示 / false: 読み取り専用表示
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <form action={updateEntrySheet} className="space-y-2">
        <input type="hidden" name="id" value={es.id} />
        <input type="hidden" name="companyId" value={companyId} />
        <input
          name="question"
          defaultValue={es.question}
          required
          autoFocus //デフォで編集
          className="w-full px-1 py-1 font-medium"
        />
        <textarea
          name="answer"
          defaultValue={es.answer}
          required
          rows={6}
          className="w-full rounded p-3 text-sm bg-gray-100"
        />
        {/* ★追加：メモ欄（未入力でもOK） */}
        <textarea
          name="memo"
          defaultValue={es.memo ?? ""}
          rows={2}
          placeholder="メモ（任意）"
          className="w-full rounded p-3 text-sm bg-yellow-50"
        />
        <button type="submit" className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
          保存
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
      </form>
    );
  }

  // 通常時：読み取り専用の表示
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-medium">{es.question}</p>
        <button
          onClick={() => setIsEditing(true)}
          aria-label="編集"
          className="text-gray-400 hover:text-blue-600"
        >
          <Pencil size={14} />
        </button>
      </div>
      <p className="text-sm whitespace-pre-wrap bg-gray-100 rounded p-3">
        {es.answer}
      </p>
      {/* ★追加：メモがある時だけ表示 */}
      {es.memo && (
        <p className="text-sm whitespace-pre-wrap bg-yellow-50 rounded p-3">
          {es.memo}
        </p>
      )}
    </div>
  );
}