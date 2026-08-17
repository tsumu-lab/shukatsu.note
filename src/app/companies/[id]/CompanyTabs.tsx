"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEditGuard } from "./EditGuardContext";

const TABS = [
  { key: "memo", label: "メモ" },
  { key: "es", label: "ES" },
  { key: "interview", label: "面接" },
  { key: "intern", label: "インターン" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function CompanyTabs({
  initialTab,
  memoTab,
  esTab,
  interviewTab,
  internTab,
}: {
  initialTab?: string;
  memoTab: React.ReactNode;
  esTab: React.ReactNode;
  interviewTab: React.ReactNode;
  internTab: React.ReactNode;
}) {
  // ★変更点：初期値をpropsで受け取ったURLの?tabから決める（無ければ"memo"）
  const isValidTab = (t?: string): t is TabKey =>
    TABS.some((tab) => tab.key === t);
  const [active, setActive] = useState<TabKey>(
    isValidTab(initialTab) ? initialTab : "memo"
  );

  const { confirmLeave } = useEditGuard();

  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (key: TabKey) => {
    if (!confirmLeave()) return; // 編集中で「キャンセル」を選んだら、タブ切り替えを止める
    setActive(key);
    router.replace(`${pathname}?tab=${key}`, { scroll: false });
  };

  const content: Record<TabKey, React.ReactNode> = {
    memo: memoTab,
    es: esTab,
    interview: interviewTab,
    intern: internTab,
  };

  return (
    <div>
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleSelect(tab.key)}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              active === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{content[active]}</div>
    </div>
  );
}