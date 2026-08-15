"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { getClickOffset } from "@/lib/clickToCaret";
import { toDatetimeLocalValue, formatReminderDate } from "@/lib/dateFormat";

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
  updateReminder,
  deleteReminder,
}: {
  item: Item;
  updateReminder: (formData: FormData) => void;
  deleteReminder: (formData: FormData) => void;
}) {
  // フックは常に呼ぶ必要があるため、企業/個人の分岐より前に全部まとめておく
  const [isEditing, setIsEditing] = useState(false);
  const [entryField, setEntryField] = useState<EntryField>("title");
  const [caretOffset, setCaretOffset] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const dueDateValue = item.dueDate ? toDatetimeLocalValue(new Date(item.dueDate)) : "";

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

  // 企業に紐づくもの：編集マークを押すと企業ページに飛び、そちらで編集モードが自動で開く
  if (item.companyId) {
    return (
      <div className="flex items-center gap-2 text-sm py-1">
        <span className="w-4 h-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
        <Link href={`/companies/${item.companyId}`} className="flex-1 hover:text-blue-600">
          {item.company?.name} {item.title}
        </Link>
        <Link
          href={`/companies/${item.companyId}?openReminder=${item.id}`}
          aria-label="編集"
          className="text-gray-300 hover:text-blue-600"
        >
          <Pencil size={12} />
        </Link>
      </div>
    );
  }

  // 個人用：編集マークを押すとその場でタイトル・日付・メモをまとめて編集
  if (isEditing) {
    return (
      <form ref={formRef} action={updateReminder} onBlur={handleFormBlur} className="py-1 space-y-1">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="companyId" value="" />
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
          <input
            ref={titleRef}
            name="title"
            defaultValue={item.title}
            required
            className="flex-1 text-sm bg-transparent border-none p-0 focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
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
            <Trash2 size={12} />
          </button>
        </div>
        <textarea
          ref={memoRef}
          name="memo"
          defaultValue={item.memo ?? ""}
          rows={2}
          placeholder="メモ（任意）"
          className="w-full rounded p-2 text-xs bg-yellow-50 border-none focus:outline-none ml-6"
          style={{ width: "calc(100% - 1.5rem)" }}
        />
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm py-1">
      <span className="w-4 h-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
      <button onClick={(e) => openAt("title", e)} className="flex-1 text-left">
        <span className="text-xs text-gray-400">（個人）</span> {item.title}
      </button>
      <button onClick={() => openAt("title")} aria-label="編集" className="text-gray-300 hover:text-blue-600">
        <Pencil size={12} />
      </button>
    </div>
  );
}