"use client";

import { useRouter } from "next/navigation";
import { useEditGuard } from "./EditGuardContext";

export default function BackButton() {
  const router = useRouter();
  const { saveAllReminders, isLocked, requestSaveHint } = useEditGuard();

  const handleClick = async () => {
    await saveAllReminders(); // リマインダーの編集中だけは保存してから進む
    if (isLocked()) {
      requestSaveHint(); // ES・面接・追加フォームが開いていたら、戻らずヒントを出す
      return;
    }
    router.push("/");
  };

  return (
    <button onClick={handleClick} className="text-sm" style={{ color: "var(--color-accent)" }}>
      ← 戻る
    </button>
  );
}