"use client";

import { useRouter } from "next/navigation";
import { useEditGuard } from "./EditGuardContext";

export default function BackButton() {
  const router = useRouter();
  const { confirmLeave } = useEditGuard();

  return (
    <button
      onClick={() => {
        if (confirmLeave()) router.push("/");
      }}
      className="text-sm text-blue-600 underline"
    >
      ← 戻る
    </button>
  );
}