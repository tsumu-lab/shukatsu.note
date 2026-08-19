"use client";

import { Trash2 } from "lucide-react";

export default function DeleteCompanyButton({
  companyId,
  companyName,
  deleteCompany,
  className = "",
}: {
  companyId: number;
  companyName: string;
  deleteCompany: (formData: FormData) => void;
  className?: string;
}) {
  return (
    <form
      action={deleteCompany}
      onSubmit={(e) => {
        if (!confirm(`「${companyName}」を削除しますか？`)) e.preventDefault();
      }}
      className={className}
    >
      <input type="hidden" name="id" value={companyId} />
      <button type="submit" aria-label="削除" className="text-gray-300 hover:text-red-500">
        <Trash2 size={14} />
      </button>
    </form>
  );
}