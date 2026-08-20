"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Trash2 } from "lucide-react";
import { getClickOffset } from "@/lib/clickToCaret";
import { formatReminderDate, toDatetimeLocalValue } from "@/lib/dateFormat";
import { useEditGuard, isLocked, requestSaveHint, hintActive } from "./EditGuardContext";
import SaveHint from "./SaveHint";

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
  const { registerReminderSave, markEditing, isLocked, requestSaveHint, hintActive } = useEditGuard();

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  // ★修正：日付だけでなく時刻も含めた形にする（前の書き方だと時刻が消えていた）
  const dueDateValue = reminder.dueDate ? toDatetimeLocalValue(new Date(reminder.dueDate)) : "";

  useEffect(() => {
    if (searchParams.get("openReminder") === String(reminder.id)) {
      setEntryField("title");
      setCaretOffset(0);
      setIsEditing(true);
    }
  }, [searchParams, reminder.id]);

  // 編集中は「トップに戻る」前に必ず保存されるよう登録しておく
  useEffect(() => {
    if (!isEditing) {
      registerReminderSave(`reminder-${reminder.id}`, null);
      return;
    }
    registerReminderSave(`reminder-${reminder.id}`, async () => {
      const fd = new FormData();
      fd.set("id", String(reminder.id));
      fd.set("companyId", String(companyId));
      fd.set("title", titleRef.current?.value ?? reminder.title);
      fd.set("dueDate", dateRef.current?.value ?? "");
      fd.set("memo", memoRef.current?.value ?? reminder.memo ?? "");
      await updateReminder(fd);
    });
    return () => registerReminderSave(`reminder-${reminder.id}`, null);
  }, [isEditing]);

  useEffect(() => {
    markEditing(`reminder-${reminder.id}`, isEditing);
    return () => markEditing(`reminder-${reminder.id}`, false);
  }, [isEditing]);

  const openAt = (field: EntryField, e?: React.MouseEvent) => {
    if (isLocked()) {
      requestSaveHint();
      return;
    }
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
        className="rounded-xl px-3 py-2 space-y-1 relative"
        style={{ backgroundColor: "var(--color-company-tint)" }}
      >
        <SaveHint show={hintActive} />
        <input type="hidden" name="id" value={reminder.id} />
        <input type="hidden" name="companyId" value={companyId} />

        <div className="flex items-center gap-3">
          <span
            className="w-5 h-5 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: "var(--color-company)" }}
          />
          <input
            ref={titleRef}
            name="title"
            defaultValue={reminder.title}
            required
            className="flex-1 text-sm bg-transparent border-none p-0 focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <Calendar size={14} style={{ color: "var(--color-taupe)" }} />
            <input
              ref={dateRef}
              name="dueDate"
              type="datetime-local"
              defaultValue={dueDateValue}
              className="text-xs bg-transparent border-none p-0 focus:outline-none"
              style={{ color: "var(--color-taupe)" }}
            />
          </div>
          <button
            type="submit"
            formAction={deleteReminder}
            onClick={(e) => {
              if (!confirm("このリマインダーを削除しますか？")) e.preventDefault();
            }}
            aria-label="削除"
            style={{ color: "var(--color-taupe)" }}
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
          className="w-full rounded p-2 text-sm border-none focus:outline-none ml-8"
          style={{ width: "calc(100% - 2rem)", backgroundColor: "var(--color-memo)" }}
        />
      </form>
    );
  }

  return (
    <div className="reminder-row company relative">
      <div className="flex items-center gap-3">
        <form action={toggleReminder}>
          <input type="hidden" name="id" value={reminder.id} />
          <input type="hidden" name="companyId" value={companyId} />
          <input type="hidden" name="completed" value={(!reminder.completed).toString()} />
          <button
            type="submit"
            aria-label="完了を切り替え"
            className="w-5 h-5 rounded-full border-2 flex-shrink-0"
            style={{
              borderColor: "var(--color-company)",
              backgroundColor: reminder.completed ? "var(--color-company)" : "transparent",
            }}
          />
        </form>

        <button
          onClick={(e) => openAt("title", e)}
          className="flex-1 text-left text-sm font-medium"
          style={{ color: "var(--color-ink)", textDecoration: reminder.completed ? "line-through" : "none" }}
        >
          {reminder.title}
        </button>

        {reminder.dueDate && (
          <button onClick={() => openAt("date")} className="text-xs flex-shrink-0" style={{ color: "var(--color-taupe)" }}>
            {formatReminderDate(new Date(reminder.dueDate))}
          </button>
        )}
      </div>

      {reminder.memo && (
        <button
          onClick={(e) => openAt("memo", e)}
          className="block text-left text-sm whitespace-pre-wrap rounded p-2 mt-1 ml-8"
          style={{ width: "calc(100% - 2rem)", backgroundColor: "var(--color-memo)" }}
        >
          {reminder.memo}
        </button>
      )}
    </div>
  );
}