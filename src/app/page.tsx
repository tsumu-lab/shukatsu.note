import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { deleteCompany, restoreCompany, createReminder } from "@/app/actions";
import Link from "next/link";
import ReminderBoard from "./ReminderBoard";
import HomeAddReminderForm from "./HomeAddReminderForm";
import UndoBanner from "./UndoBanner";
import AuthButton from "./AuthButton";
import CompanyList from "./CompanyList";

export default async function Home() {
  const userId = await requireUserId();

  const [companies, reminders] = await Promise.all([
    prisma.company.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      include: {
        reminders: {
          where: { completed: false, deletedAt: null },
          orderBy: { dueDate: "asc" },
          select: { dueDate: true },
        },
      },
    }),
    prisma.reminder.findMany({
      where: {
        userId,
        completed: false,
        deletedAt: null,
        OR: [{ companyId: null }, { company: { deletedAt: null } }],
      },
      include: { company: true },
    }),
  ]);

  // 各企業の「一番近いリマインダーの日付」だけを取り出しておく（並び替えで使う）
  const companiesForList = companies.map((c) => ({
    ...c,
    hasReminder: c.reminders.length > 0, // ★変更：日付の有無に関わらず「未完了のリマインダーがあるか」
    earliestReminder: c.reminders[0]?.dueDate ?? null,
  }));

  return (
    <>
      <header className="flex justify-end mb-2">
        <AuthButton />
      </header>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 font-heading">就活ノート</h1>

        <div className="inline-flex gap-4 mb-6 ml-4">
          <Link href="/notes/memo" className="text-sm" style={{ color: "var(--color-accent)" }}>🗒️ 個人メモ</Link>
          <Link href="/notes/self_pr" className="text-sm" style={{ color: "var(--color-accent)" }}>📝 自己PR・ガクチカ</Link>
          <Link href="/notes/interview" className="text-sm" style={{ color: "var(--color-accent)" }}>🗣️ 面接</Link>
          <Link href="/notes/gd" className="text-sm" style={{ color: "var(--color-accent)" }}>👥 グループディスカッション</Link>
        </div>

        <UndoBanner actions={{ company: restoreCompany }} />

        <div className="surface-card rounded-2xl p-3 mb-6">
          <ReminderBoard reminders={reminders} />
          <HomeAddReminderForm companies={companies} createReminder={createReminder} />
        </div>

        <CompanyList companies={companiesForList} deleteCompany={deleteCompany} />
      </main>
    </>
  );
}
