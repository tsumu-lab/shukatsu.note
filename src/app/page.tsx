import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ReminderBoard from "./ReminderBoard";
import { requireUserId } from "@/lib/auth-helpers";
import CopyButton from "./CopyButton";
import { deleteCompany, restoreCompany } from "@/app/actions";
import UndoBanner from "./UndoBanner";
import { Trash2 } from "lucide-react";
import DeleteCompanyButton from "./DeleteCompanyButton";
import HomeAddReminderForm from "./HomeAddReminderForm";
import { createReminder } from "@/app/actions";
import AuthButton from "./AuthButton";


export default async function Home() {
  const userId = await requireUserId();

  // 企業一覧とリマインダー一覧を「同時に」取得する（今までは順番待ちしていた）
  const [companies, reminders] = await Promise.all([
    prisma.company.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
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

  return (
    <>
    <header className="flex justify-end mb-2">
        <AuthButton />
    </header>
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">就活ノート</h1>
      <UndoBanner actions={{ company: restoreCompany }} />
      <div className="surface-card rounded-2xl p-3 mb-6">
        <ReminderBoard reminders={reminders} />
        <HomeAddReminderForm companies={companies} createReminder={createReminder} />
      </div>
      <Link href="/companies/new" className="inline-block mb-6 text-blue-600 underline">
        ＋ 企業を追加
      </Link>
      
      <div className="inline-flex gap-4 mb-6 ml-4">
        <Link href="/notes/self_pr" className="text-blue-600 underline text-sm">📝 自己PR・ガクチカ</Link>
        <Link href="/notes/interview" className="text-blue-600 underline text-sm">🗣️ 面接</Link>
        <Link href="/notes/gd" className="text-blue-600 underline text-sm">👥 グループディスカッション</Link>
      </div>

      <div className="space-y-4">
        {companies.length === 0 && (
          <p className="text-gray-500">まだ企業が登録されていません</p>
        )}

        {companies.map((company) => (
          <div key={company.id} className="rounded-2xl p-4 relative" style={{ backgroundColor: "var(--color-company-bg)" }}>
            <DeleteCompanyButton
              companyId={company.id}
              companyName={company.name}
              deleteCompany={deleteCompany}
            />

            <Link href={`/companies/${company.id}`} className="font-semibold hover:text-blue-600">
              {company.name}{" "}
              <span className="text-xs text-gray-500 font-normal">
                （{company.status}）
              </span>
            </Link>
            {company.deadline && (
              <p className="text-sm text-gray-500 mt-1">
                締切: {company.deadline.toLocaleDateString("ja-JP")}
              </p>
            )}
            {(company.mypageUrl || company.mypageId) && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                {company.mypageUrl && (
                  <a href={company.mypageUrl} target="_blank" className="text-blue-600 underline">
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
      </div>
    </main>
    </>
  );
}