import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import {
  addEntrySheet,
  updateEntrySheet,
  deleteEntrySheet,
  restoreEntrySheet,
  toggleReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  restoreReminder,
  updateStatus,
  updateMypageUrl,
  updateMypageId,
  updateMypagePw,
  createMemoEntry,
  updateMemoEntry,
  deleteMemoEntry,
  restoreMemoEntry,
  createInterview,
  updateInterview,
  deleteInterview,
  restoreInterview,
  createInternNote,
  updateInternNote,
  deleteInternNote,
  restoreInternNote,
} from "@/app/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import EntrySheetCard from "./EntrySheetCard";
import AddEntrySheetForm from "./AddEntrySheetForm";
import ReminderRow from "./ReminderRow";
import AddReminderForm from "./AddReminderForm";
import MypageField from "./MypageField";
import CompanyTabs from "./CompanyTabs";
import CompanyMemoTab from "./CompanyMemoTab";
import InterviewTab from "./InterviewTab";
import InternTab from "./InternTab";
import UndoBanner from "@/app/UndoBanner";

export default async function CompanyDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; openReminder?: string }>; // ★変更
}) {
  const userId = await requireUserId();
  const { id } = await params;
  const { tab, openReminder } = await searchParams; // ★変更

  const company = await prisma.company.findUnique({
    where: { id: Number(id) },
    include: {
      entrySheets: { where: { deletedAt: null } },
      reminders: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
      memoEntries: { where: { deletedAt: null } },
      interviews: { where: { deletedAt: null } },
      internNotes: { where: { deletedAt: null } },
    },
  });

  if (!company || company.userId !== userId || company.deletedAt) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm text-blue-600 underline">
        ← 戻る
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-1">{company.name}</h1>
      <UndoBanner
        actions={{
          reminder: restoreReminder,
          entrySheet: restoreEntrySheet,
          interview: restoreInterview,
          memoEntry: restoreMemoEntry,
          internNote: restoreInternNote,
        }}
      />

      <form action={updateStatus} className="flex gap-3 items-end mt-4">
        <input type="hidden" name="id" value={company.id} />
        <div>
          <label className="block text-sm mb-1">状況</label>
          <select name="status" defaultValue={company.status} className="border rounded px-2 py-1">
            <option>検討中</option>
            <option>ES提出済み</option>
            <option>一次面接</option>
            <option>二次面接</option>
            <option>最終面接</option>
            <option>内定</option>
            <option>不合格</option>
            <option>辞退</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">優先度</label>
          <select name="priority" defaultValue={company.priority} className="border rounded px-2 py-1">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button type="submit" className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
          更新
        </button>
      </form>

      <div className="space-y-1 mt-4 mb-4">
        <MypageField label="URL" value={company.mypageUrl} companyId={company.id} action={updateMypageUrl} isLink showCopy />
        <MypageField label="ID" value={company.mypageId} companyId={company.id} action={updateMypageId} showCopy />
        <MypageField label="PW" value={company.mypagePw} companyId={company.id} action={updateMypagePw} />
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">リマインダー</h2>
      <div className="border rounded-lg divide-y mb-3">
        {company.reminders.map((r) => (
          <ReminderRow
            key={`${r.id}-${r.updatedAt.getTime()}`}
            reminder={r}
            companyId={company.id}
            toggleReminder={toggleReminder}
            updateReminder={updateReminder}
            deleteReminder={deleteReminder}
            startOpen={String(r.id) === openReminder} // ★追加
          />
        ))}
        {company.reminders.length === 0 && (
          <p className="text-sm text-gray-400 px-4 py-3">リマインダーはまだありません</p>
        )}
      </div>
      <AddReminderForm companyId={company.id} createReminder={createReminder} />

      <div className="mt-8">
        <CompanyTabs
          initialTab={tab}
          memoTab={
            <CompanyMemoTab
              companyId={company.id}
              memoEntries={company.memoEntries}
              createMemoEntry={createMemoEntry}
              updateMemoEntry={updateMemoEntry}
              deleteMemoEntry={deleteMemoEntry}
            />
          }
          esTab={
            <div className="space-y-6">
              <div className="space-y-6">
                {company.entrySheets.map((es) => (
                  <EntrySheetCard
                    key={`${es.id}-${es.updatedAt.getTime()}`}
                    es={es}
                    companyId={company.id}
                    updateEntrySheet={updateEntrySheet}
                    deleteEntrySheet={deleteEntrySheet}
                  />
                ))}
              </div>
              <AddEntrySheetForm companyId={company.id} addEntrySheet={addEntrySheet} />
            </div>
          }
          interviewTab={
            <InterviewTab
              companyId={company.id}
              interviews={company.interviews}
              createInterview={createInterview}
              updateInterview={updateInterview}
              deleteInterview={deleteInterview}
            />
          }
          internTab={
            <InternTab
              companyId={company.id}
              internNotes={company.internNotes}
              createInternNote={createInternNote}
              updateInternNote={updateInternNote}
              deleteInternNote={deleteInternNote}
            />
          }
        />
      </div>
    </main>
  );
}