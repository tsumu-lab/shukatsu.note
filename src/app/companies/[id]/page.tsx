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
import BackButton from "./BackButton";
import { EditGuardProvider } from "./EditGuardContext";
import DeleteCompanyButton from "./DeleteCompanyButton";
import { deleteCompany } from "@/app/actions";
import StatusPriorityForm from "./StatusPriorityForm";

export default async function CompanyDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; openReminder?: string }>;
}) {
  const userId = await requireUserId();
  const { id } = await params;
  const { tab, openReminder } = await searchParams;

  const company = await prisma.company.findUnique({
    where: { id: Number(id) },
    include: {
      reminders: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
      entrySheets: { where: { deletedAt: null }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] },
      memoEntries: { where: { deletedAt: null }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] },
      interviews: { where: { deletedAt: null }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] },
      internNotes: { where: { deletedAt: null }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] },
    },
  });

  if (!company || company.userId !== userId || company.deletedAt) notFound();
    // 閲覧日時だけ記録する（updatedAtは変えない）
  await prisma.$executeRaw`UPDATE "Company" SET "lastViewedAt" = NOW() WHERE id = ${company.id}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-company-bg)" }}>
      <main className="max-w-[63rem] mx-auto p-6">
        <EditGuardProvider>
          <BackButton />

          <h1 className="text-2xl font-bold mt-2 mb-1 font-heading">{company.name}</h1>
          <UndoBanner
            actions={{
              reminder: restoreReminder,
              entrySheet: restoreEntrySheet,
              interview: restoreInterview,
              memoEntry: restoreMemoEntry,
              internNote: restoreInternNote,
            }}
          />

          <div className="flex gap-3 items-end justify-between mt-4">
            <StatusPriorityForm
              companyId={company.id}
              status={company.status}
              priority={company.priority}
              updateStatus={updateStatus}
            />
            <DeleteCompanyButton companyId={company.id} companyName={company.name} deleteCompany={deleteCompany} />
          </div>

          {/* マイページ欄：白カードでまとめる */}
          <div className="surface-card rounded-2xl p-3 mt-4 mb-4 space-y-1">
            <MypageField label="URL" value={company.mypageUrl} companyId={company.id} action={updateMypageUrl} isLink showCopy />
            <MypageField label="ID" value={company.mypageId} companyId={company.id} action={updateMypageId} showCopy />
            <MypageField label="PW" value={company.mypagePw} companyId={company.id} action={updateMypagePw} />
          </div>

          {/* リマインダー：白カードでまとめる */}
          <div className="surface-card rounded-2xl p-3 mb-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: "var(--color-taupe)" }}>リマインダー</h2>
            <div className="space-y-2">
              {company.reminders.map((r) => (
                <ReminderRow
                  key={`${r.id}-${r.updatedAt.getTime()}`}
                  reminder={r}
                  companyId={company.id}
                  toggleReminder={toggleReminder}
                  updateReminder={updateReminder}
                  deleteReminder={deleteReminder}
                />
              ))}
            </div>
            <AddReminderForm companyId={company.id} createReminder={createReminder} />
          </div>

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
            <div className="space-y-3">
              {company.entrySheets.map((es) => (
                <EntrySheetCard
                  key={`${es.id}-${es.updatedAt.getTime()}`}
                  es={es}
                  companyId={company.id}
                  updateEntrySheet={updateEntrySheet}
                  deleteEntrySheet={deleteEntrySheet}
                />
              ))}
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
        </EditGuardProvider>
      </main>
    </div>
  );
}