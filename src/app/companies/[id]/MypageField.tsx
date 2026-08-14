"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import CopyButton from "@/app/CopyButton";

export default function MypageField({
  label,
  value,
  companyId,
  action,
  isLink = false,
  showCopy = false,
}: {
  label: string;
  value: string | null;
  companyId: number;
  action: (formData: FormData) => void;
  isLink?: boolean;
  showCopy?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!value && !isEditing) {
    return (
      <button onClick={() => setIsEditing(true)} className="text-sm text-gray-400">
        {label}を入力...
      </button>
    );
  }

  if (isEditing) {
    return (
      <form action={action} className="flex items-center gap-2">
        <input type="hidden" name="companyId" value={companyId} />
        <span className="text-xs text-gray-500 w-8 flex-shrink-0">{label}</span>
        <input
          name="value"
          defaultValue={value ?? ""}
          autoFocus
          className="border rounded px-2 py-1 text-sm flex-1"
        />
        <button type="submit" className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
          保存
        </button>
        <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-gray-500">
          キャンセル
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-8 flex-shrink-0">{label}</span>
      {isLink ? (
        <a href={value!} target="_blank" className="text-sm text-blue-600 underline truncate flex-1">
          {value}
        </a>
      ) : (
        <span className="text-sm flex-1">{value}</span>
      )}
      {showCopy && <CopyButton value={value!} />}
      <button onClick={() => setIsEditing(true)} aria-label="編集" className="text-gray-400 hover:text-blue-600">
        <Pencil size={14} />
      </button>
    </div>
  );
}