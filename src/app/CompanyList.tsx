"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ChevronDown, Check } from "lucide-react";
import PinButton from "./PinButton";
import DeleteCompanyButton from "./companies/[id]/DeleteCompanyButton";
import CopyButton from "./CopyButton";
import { togglePinCompany } from "@/app/actions";

const STATUS_OPTIONS = [
  "検討中", "ES提出済み", "一次面接", "二次面接", "最終面接", "内定", "不合格", "辞退",
];

const SORT_OPTIONS = [
  { key: "createdAt", label: "追加日" },
  { key: "priority", label: "優先度" },
  { key: "updatedAt", label: "更新日" },
  { key: "lastViewedAt", label: "閲覧日" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

type Company = {
  id: number;
  name: string;
  status: string;
  priority: number;
  pinned: boolean;
  mypageUrl: string | null;
  mypageId: string | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastViewedAt: Date | null;
  earliestReminder: Date | null;
  hasReminder: boolean;
};

export default function CompanyList({
  companies,
  deleteCompany,
}: {
  companies: Company[];
  deleteCompany: (formData: FormData) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // nullが「全て」
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [ascending, setAscending] = useState(false);
  const [reminderPriority, setReminderPriority] = useState(true);

     const isFirstRender = useRef(true);

  // 並び替え設定だけを、最初に1回読み込む（検索・状況フィルターは対象外）
  useEffect(() => {
    const saved = localStorage.getItem("companySortPref");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSortKey(parsed.sortKey ?? "createdAt");
      setAscending(parsed.ascending ?? false);
      setReminderPriority(parsed.reminderPriority ?? true);
    }
  }, []);

  // 並び替え設定が変わるたびに保存する。
  // ただし一番最初の実行(＝ページを開いた瞬間、読み込みが終わる前の古い値)だけはスキップする
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(
      "companySortPref",
      JSON.stringify({ sortKey, ascending, reminderPriority })
    );
  }, [sortKey, ascending, reminderPriority]);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visible = useMemo(() => {
    let list = companies;
    if (search.trim()) list = list.filter((c) => c.name.includes(search.trim()));
    if (statusFilter) list = list.filter((c) => c.status === statusFilter);

    const val = (c: Company) => {
      if (sortKey === "priority") return c.priority;
      if (sortKey === "updatedAt") return new Date(c.updatedAt).getTime();
      if (sortKey === "lastViewedAt") return c.lastViewedAt ? new Date(c.lastViewedAt).getTime() : 0;
      return new Date(c.createdAt).getTime();
    };

    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; // ピンは常に最優先

      if (reminderPriority) {
        if (a.hasReminder !== b.hasReminder) return a.hasReminder ? -1 : 1;
        if (a.hasReminder && b.hasReminder && a.earliestReminder && b.earliestReminder) {
          const diff = new Date(a.earliestReminder).getTime() - new Date(b.earliestReminder).getTime();
          if (diff !== 0) return diff;
        }
      }

      const diff = val(a) - val(b);
      return ascending ? diff : -diff;
    });
  }, [companies, search, statusFilter, sortKey, ascending, reminderPriority]);

  return (
    <div>
      {/* ツールバー */}
      <div className="flex items-center gap-2 mb-4 relative">
        <Link
          href="/companies/new"
          className="text-sm text-white px-3 py-2 rounded-lg whitespace-nowrap"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          ＋企業を追加
        </Link>

        <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--color-surface)" }}>
          <Search size={14} style={{ color: "var(--color-taupe)" }} />
                    <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            placeholder="検索"
            className="flex-1 bg-transparent border-none text-sm focus:outline-none"
          />
        </div>

        {/* 状況フィルター */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => { setStatusOpen((v) => !v); setSortOpen(false); }}
            className="flex items-center gap-1 text-sm rounded-lg px-3 py-2 whitespace-nowrap"
            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink)" }}
          >
            {statusFilter ?? "全て"}
            <ChevronDown size={14} />
          </button>
          {statusOpen && (
            <div className="absolute right-0 top-full mt-1 rounded-xl p-2 z-10 surface-card" style={{ minWidth: 140 }}>
              <button
                onClick={() => { setStatusFilter(null); setStatusOpen(false); }}
                className="flex items-center justify-between w-full text-sm px-2 py-1.5 rounded"
              >
                全て {!statusFilter && <Check size={14} />}
              </button>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                  className="flex items-center justify-between w-full text-sm px-2 py-1.5 rounded"
                >
                  {s} {statusFilter === s && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 並び替え */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => { setSortOpen((v) => !v); setStatusOpen(false); }}
            aria-label="並び替え"
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink)" }}
          >
            <ArrowUpDown size={16} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 rounded-xl p-2 z-10 surface-card" style={{ minWidth: 180 }}>
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-xs" style={{ color: "var(--color-taupe)" }}>並び替え</span>
                <button
                  onClick={() => setAscending((v) => !v)}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: "var(--color-paper)" }}
                >
                  {ascending ? "↑昇順" : "↓降順"}
                </button>
              </div>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortKey(opt.key)}
                  className="flex items-center justify-between w-full text-sm px-2 py-1.5 rounded"
                >
                  {opt.label} {sortKey === opt.key && <Check size={14} />}
                </button>
              ))}
              <div className="border-t my-1" style={{ borderColor: "var(--color-border)" }} />
              <button
                onClick={() => setReminderPriority((v) => !v)}
                className="flex items-center justify-between w-full text-sm px-2 py-1.5 rounded"
                //style={{ backgroundColor: reminderPriority ? "var(--color-paper)" : "transparent" }}
              >
                リマインド {reminderPriority && <Check size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 企業カード一覧 */}
      <div className="space-y-4">
        {visible.map((company) => (
          <div key={company.id} className="rounded-2xl p-4 relative" style={{ backgroundColor: "var(--color-company-bg)" }}>
            <PinButton
              pinned={company.pinned}
              formData={{ id: company.id }}
              action={togglePinCompany}
              className="absolute top-3 right-3"
            />
            <Link href={`/companies/${company.id}`} className="font-semibold hover:opacity-70">
              {company.name}{" "}
              <span className="text-xs font-normal" style={{ color: "var(--color-taupe)" }}>
                （{company.status}）
              </span>
            </Link>
            {company.deadline && (
              <p className="text-sm mt-1" style={{ color: "var(--color-taupe)" }}>
                締切: {company.deadline.toLocaleDateString("ja-JP")}
              </p>
            )}
            {(company.mypageUrl || company.mypageId) && (
              <p className="text-xs mt-1 flex items-center gap-2 flex-wrap" style={{ color: "var(--color-taupe)" }}>
                {company.mypageUrl && (
                  <a href={company.mypageUrl} target="_blank" style={{ color: "var(--color-accent)" }}>
                    マイページ
                  </a>
                )}
                {company.mypageId && (
                  <span className="flex items-center gap-1">
                    ID: {company.mypageId}
                    <CopyButton value={company.mypageId} />
                  </span>
                )}
              </p>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-sm" style={{ color: "var(--color-taupe)" }}>該当する企業がありません</p>
        )}
      </div>
    </div>
  );
}