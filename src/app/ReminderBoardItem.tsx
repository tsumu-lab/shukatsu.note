"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { getClickOffset } from "@/lib/clickToCaret";
import { toDatetimeLocalValue } from "@/lib/dateFormat";

type Item = {
  id: number;
  title: string;
  dueDate: Date | null;
  memo: string | null;
  companyId: number | null;
  company: { id: number; name: string } | null;
};

type EntryField = "title" | "date" | "memo";

export default function ReminderBoardItem({
  item,
  toggleReminder,
  updateReminder,
  deleteReminder,
}: {
  item: Item;
  toggleReminder: (formData: FormData) => void;
  updateReminder: (formData: FormData) => void;
  deleteReminder: (formData: FormData) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [entryField, setEntryField] = useState<EntryField>("title");
  const [caretOffset, setCaretOffset] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const dueDateValue = item.dueDate ? toDatetimeLocalValue(new Date(item.dueDate)) : "";
  const typeClass = item.companyId ? "company" : "personal"; // ★これで色が決まる
  const typeColor = item.companyId ? "var(--color-company)" : "var(--color-personal)";

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

  if (isCompleting) return null;

  const CheckButton = () => (
    <form action={toggleReminder} onSubmit={() => setIsCompleting(true)}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="companyId" value={item.companyId ?? ""} />
      <input type="hidden" name="completed" value="true" />
      <button
        type="submit"
        aria-label="完了にする"
        className="w-4 h-4 rounded-full border-2 flex-shrink-0"
        style={{ borderColor: typeColor }}
      />
    </form>
  );

  // 企業に紐づくもの：水色。押すとその企業ページへ
  if (item.companyId) {
    return (
      <div className={`reminder-row ${typeClass} flex items-center gap-2 text-sm`}>
        <CheckButton />
        <Link href={`/companies/${item.companyId}`} className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="flex-shrink-0 overflow-x-auto whitespace-nowrap no-scrollbar"
            style={{ width: "10em" }}
          >
            {item.company?.name}
          </span>
          <span className="truncate">{item.title}</span>
        </Link>
        <Link
          href={`/companies/${item.companyId}?openReminder=${item.id}`}
          aria-label="編集"
          className="flex-shrink-0"
          style={{ color: typeColor }}
        >
          <Pencil size={12} />
        </Link>
      </div>
    );
  }

  // 個人用：ピンク
  if (isEditing) {
    return (
      <form ref={formRef} action={updateReminder} onBlur={handleFormBlur} className={`reminder-row ${typeClass} space-y-1`}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="companyId" value="" />
        <div className="flex items-center gap-2">
          <CheckButton />
          <input
            ref={titleRef}
            name="title"
            defaultValue={item.title}
            required
            className="flex-1 text-sm bg-transparent border-none p-0 focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <Calendar size={12} style={{ color: typeColor }} />
            <input
              ref={dateRef}
              name="dueDate"
              type="datetime-local"
              defaultValue={dueDateValue}
              className="text-xs bg-transparent border-none p-0 focus:outline-none"
              style={{ color: typeColor }}
            />
          </div>
          <button
            type="submit"
            formAction={deleteReminder}
            onClick={(e) => {
              if (!confirm("このリマインダーを削除しますか？")) e.preventDefault();
            }}
            aria-label="削除"
            className="flex-shrink-0"
            style={{ color: typeColor }}
          >
            <Trash2 size={12} />
          </button>
        </div>
        <textarea
          ref={memoRef}
          name="memo"
          defaultValue={item.memo ?? ""}
          rows={2}
          placeholder="メモ（任意）"
          className="w-full rounded p-2 text-xs border-none focus:outline-none ml-6"
          style={{ width: "calc(100% - 1.5rem)", backgroundColor: "var(--color-surface)" }}
        />
      </form>
    );
  }

  return (
    <div className={`reminder-row ${typeClass} flex items-center gap-2 text-sm`}>
      <CheckButton />
      <button onClick={(e) => openAt("title", e)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
        <span className="flex-shrink-0 text-xs" style={{ width: "10em", color: typeColor }}>
          （個人）
        </span>
        <span className="truncate">{item.title}</span>
      </button>
      <button onClick={() => openAt("title")} aria-label="編集" className="flex-shrink-0" style={{ color: typeColor }}>
        <Pencil size={12} />
      </button>
    </div>
  );
}