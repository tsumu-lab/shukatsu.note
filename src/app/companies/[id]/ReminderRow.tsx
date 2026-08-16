"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Trash2 } from "lucide-react";
import { getClickOffset } from "@/lib/clickToCaret";
import { toDatetimeLocalValue, formatReminderDate } from "@/lib/dateFormat";

type Reminder = {
  id: number;
  title: string;
  dueDate: Date | null;
  completed: boolean;
  memo: string | null;
};

type EntryField = "title" | "date" | "memo";

export default function ReminderRow({
  reminder,
  companyId,
  toggleReminder,
  updateReminder,
  deleteReminder,
}: {
  reminder: Reminder;
  companyId: number;
  toggleReminder: (formData: FormData) => void;
  updateReminder: (formData: FormData) => void;
  deleteReminder: (formData: FormData) => void;
}) {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [entryField, setEntryField] = useState<EntryField>("title");
  const [caretOffset, setCaretOffset] = useState(0);
  const [optimisticDone, setOptimisticDone] = useState(reminder.completed); // ★追加

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const dueDateValue = reminder.dueDate ? toDatetimeLocalValue(new Date(reminder.dueDate)) : "";

  // トップ画面の鉛筆マークから ?openReminder=このID で飛んできたら、自動で編集モードを開く
  useEffect(() => {
    if (searchParams.get("openReminder") === String(reminder.id)) {
      setEntryField("title");
      setCaretOffset(0);
      setIsEditing(true);
    }
  }, [searchParams, reminder.id]);

  const openAt = (field: EntryField, e?: React.MouseEvent) => {
    setCaretOffset(e ? getClickOffset(e) : 0);
    setEntryField(field);
    setIsEditing(true);
  };

  useEffect(() => {
    if (!isEditing) return;
    if (entryField === "title" && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.setSelectionRange(caretOffset, caretOffset);
    } else if (entryField === "memo" && memoRef.current) {
      memoRef.current.focus();
      memoRef.current.setSelectionRange(caretOffset, caretOffset);
    } else if (entryField === "date" && dateRef.current) {
      dateRef.current.focus();
    }
  }, [isEditing, entryField, caretOffset]);

  const handleFormBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      formRef.current?.requestSubmit();
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={updateReminder}
        onBlur={handleFormBlur}
        className="px-4 py-2 space-y-1"
      >
        <input type="hidden" name="id" value={reminder.id} />
        <input type="hidden" name="companyId" value={companyId} />

        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0" />

          <input
            ref={titleRef}
            name="title"
            defaultValue={reminder.title}
            required
            className="flex-1 text-sm bg-transparent border-none p-0 focus:outline-none"
          />

          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-gray-400" />
            <input
              ref={dateRef}
              name="dueDate"
              type="datetime-local"
              defaultValue={dueDateValue}
              className="text-xs text-gray-500 bg-transparent border-none p-0 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            formAction={deleteReminder}
            onClick={(e) => {
              if (!confirm("このリマインダーを削除しますか？")) e.preventDefault();
            }}
            aria-label="削除"
            className="text-gray-300 hover:text-red-500 flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <textarea
          ref={memoRef}
          name="memo"
          defaultValue={reminder.memo ?? ""}
          rows={2}
          placeholder="メモ（任意）"
          className="w-full rounded p-2 text-sm bg-yellow-50 border-none focus:outline-none ml-8"
          style={{ width: "calc(100% - 2rem)" }}
        />
      </form>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-3">
        <form
          action={toggleReminder}
          onSubmit={() => setOptimisticDone(!optimisticDone)} // ★押した瞬間に見た目だけ先に切り替える
        >
          <input type="hidden" name="id" value={reminder.id} />
          <input type="hidden" name="companyId" value={companyId} />
          <input type="hidden" name="completed" value={(!reminder.completed).toString()} />
          <button
            type="submit"
            aria-label="完了を切り替え"
            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
              optimisticDone ? "bg-gray-400 border-gray-400" : "border-gray-400"
            }`}
          />
        </form>

        <button
          onClick={(e) => openAt("title", e)}
          className={`flex-1 text-left text-sm ${
            optimisticDone ? "line-through text-gray-400" : ""
          }`}
        >
          {reminder.title}
        </button>

        {reminder.dueDate && (
          <button onClick={() => openAt("date")} className="text-xs text-gray-500">
            {formatReminderDate(new Date(reminder.dueDate))}
          </button>
        )}
      </div>

      {reminder.memo && (
        <button
          onClick={(e) => openAt("memo", e)}
          className="block text-left text-sm whitespace-pre-wrap bg-yellow-50 rounded p-2 mt-1 ml-8"
          style={{ width: "calc(100% - 2rem)" }}
        >
          {reminder.memo}
        </button>
      )}
    </div>
  );
}