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
  const isValidTab = (t?: string): t is TabKey => TABS.some((tab) => tab.key === t);
  const [active, setActive] = useState<TabKey>(isValidTab(initialTab) ? initialTab : "memo");

  const router = useRouter();
  const pathname = usePathname();

  const { isLocked, requestSaveHint } = useEditGuard();

  const handleSelect = (key: TabKey) => {
    if (isLocked()) {
      requestSaveHint();
      return;
    }
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
      <div className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleSelect(tab.key)}
            className={`tab-btn ${active === tab.key ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="surface-card rounded-2xl p-5" style={{ borderTopLeftRadius: active === "memo" ? 0 : undefined }}>
        {content[active]}
      </div>
    </div>
  );
}