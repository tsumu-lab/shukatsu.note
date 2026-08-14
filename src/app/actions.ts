"use server"; //バックエンド的な

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/auth-helpers";

// 指定したcompanyIdが、今ログインしている人のものか確認する共通処理
// 違えば処理を止める（他人のデータを書き換えられないようにするため）
async function assertOwnsCompany(companyId: number, userId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company || company.userId !== userId) {
    throw new Error("この操作を行う権限がありません");
  }
}

// 企業を新規作成
export async function createCompany(formData: FormData) {
  const userId = await requireUserId();
  const name = formData.get("name") as string;
  const mypageUrl = formData.get("mypageUrl") as string;
  const mypageId = formData.get("mypageId") as string; // ★変更：締切の代わりにID


  await prisma.company.create({
    data: {
      userId,
      name,
      mypageUrl: mypageUrl || null,
      mypageId: mypageId || null, // ★変更
    },
  });

  redirect("/");
}

// 状況・優先度を更新
export async function updateStatus(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  await assertOwnsCompany(id, userId);

  const status = formData.get("status") as string;
  const priority = Number(formData.get("priority"));

  await prisma.company.update({
    where: { id },
    data: { status, priority },
  });

  redirect(`/companies/${id}`);
}

// ESを新規作成
export async function addEntrySheet(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const memo = formData.get("memo") as string;

  await prisma.entrySheet.create({
    data: { companyId, question, answer, memo: memo || null },
  });

  redirect(`/companies/${companyId}?tab=es`);
}

// 既存のESを更新
export async function updateEntrySheet(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const memo = formData.get("memo") as string;

  // idとcompanyIdが両方一致する行だけ更新（他人のESを誤って書き換えないため）
  await prisma.entrySheet.updateMany({
    where: { id, companyId },
    data: { question, answer, memo: memo || null },
  });

  redirect(`/companies/${companyId}?tab=es`);
}

// リマインダーの持ち主を直接確認する（企業経由ではなく、Reminder自身のuserIdを見る）
async function assertOwnsReminder(id: number, userId: string) {
  const reminder = await prisma.reminder.findUnique({ where: { id } });
  if (!reminder || reminder.userId !== userId) {
    throw new Error("この操作を行う権限がありません");
  }
  return reminder;
}

// リマインダーを新規作成（companyIdがあれば企業に紐づく、無ければ個人用）
export async function createReminder(formData: FormData) {
  const userId = await requireUserId();
  const companyIdRaw = formData.get("companyId") as string;
  const companyId = companyIdRaw ? Number(companyIdRaw) : null;

  if (companyId) {
    await assertOwnsCompany(companyId, userId);
  }

  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;

  await prisma.reminder.create({
    data: {
      userId,
      companyId,
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  redirect(companyId ? `/companies/${companyId}` : "/");
}

// 完了/未完了を切り替え
export async function toggleReminder(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const reminder = await assertOwnsReminder(id, userId);
  const completed = formData.get("completed") === "true";

  await prisma.reminder.update({ where: { id }, data: { completed } });
  redirect(reminder.companyId ? `/companies/${reminder.companyId}` : "/");
}

// タイトル・日付・メモを更新
export async function updateReminder(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const reminder = await assertOwnsReminder(id, userId);

  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;
  const memo = formData.get("memo") as string;

  await prisma.reminder.update({
    where: { id },
    data: { title, dueDate: dueDate ? new Date(dueDate) : null, memo: memo || null },
  });

  redirect(reminder.companyId ? `/companies/${reminder.companyId}` : "/");
}

// 削除（論理削除）
export async function deleteReminder(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const reminder = await assertOwnsReminder(id, userId);

  await prisma.reminder.update({ where: { id }, data: { deletedAt: new Date() } });
  const base = reminder.companyId ? `/companies/${reminder.companyId}` : "/";
  redirect(`${base}?undo=reminder&undoId=${id}`);
}

// 元に戻す
export async function restoreReminder(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const reminder = await assertOwnsReminder(id, userId);

  await prisma.reminder.update({ where: { id }, data: { deletedAt: null } });
  redirect(reminder.companyId ? `/companies/${reminder.companyId}` : "/");
}

// マイページURLを保存
export async function updateMypageUrl(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const value = formData.get("value") as string;
  await prisma.company.update({
    where: { id: companyId },
    data: { mypageUrl: value || null },
  });
  redirect(`/companies/${companyId}`);
}

// マイページIDを保存
export async function updateMypageId(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const value = formData.get("value") as string;
  await prisma.company.update({
    where: { id: companyId },
    data: { mypageId: value || null },
  });
  redirect(`/companies/${companyId}`);
}

// マイページPWを保存
export async function updateMypagePw(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const value = formData.get("value") as string;
  await prisma.company.update({
    where: { id: companyId },
    data: { mypagePw: value || null },
  });
  redirect(`/companies/${companyId}`);
}

// 個人メモを新規作成
export async function createNote(formData: FormData) {
  const userId = await requireUserId();
  const category = formData.get("category") as string; // ★追加
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.personalNote.create({
    data: { userId, category, title, content },
  });

  redirect(`/notes/${category}`); // ★変更
}

// 個人メモを更新
export async function updateNote(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const category = formData.get("category") as string; // ★追加
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.personalNote.updateMany({
    where: { id, userId },
    data: { title, content },
  });

  redirect(`/notes/${category}`); // ★変更
}

// 企業メモ（タブの「メモ」用）を保存
export async function updateCompanyMemo(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const memo = formData.get("memo") as string;

  await prisma.company.update({
    where: { id: companyId },
    data: { memo: memo || null },
  });

  redirect(`/companies/${companyId}?tab=memo`);
}

// 企業メモを新規追加
export async function createMemoEntry(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const content = formData.get("content") as string;
  if (!content?.trim()) redirect(`/companies/${companyId}?tab=memo`); // 空なら何もしない

  await prisma.memoEntry.create({ data: { companyId, content } });
  redirect(`/companies/${companyId}?tab=memo`);
}

// 企業メモを更新
export async function updateMemoEntry(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const content = formData.get("content") as string;
  await prisma.memoEntry.updateMany({
    where: { id, companyId },
    data: { content },
  });
  redirect(`/companies/${companyId}?tab=memo`);
}

// 面接記録を新規作成
export async function createInterview(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const memo = formData.get("memo") as string;

  await prisma.interview.create({
    data: { companyId, question, answer: answer || null, memo: memo || null },
  });

  redirect(`/companies/${companyId}?tab=interview`);
}

// 面接記録を更新
export async function updateInterview(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const memo = formData.get("memo") as string;

  await prisma.interview.updateMany({
    where: { id, companyId },
    data: { question, answer: answer || null, memo: memo || null },
  });

  redirect(`/companies/${companyId}?tab=interview`);
}

// インターンメモを新規追加
export async function createInternNote(formData: FormData) {
  const userId = await requireUserId();
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const content = formData.get("content") as string;
  if (!content?.trim()) redirect(`/companies/${companyId}?tab=intern`);

  await prisma.internNote.create({ data: { companyId, content } });
  redirect(`/companies/${companyId}?tab=intern`);
}

// インターンメモを更新
export async function updateInternNote(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);

  const content = formData.get("content") as string;
  await prisma.internNote.updateMany({
    where: { id, companyId },
    data: { content },
  });
  redirect(`/companies/${companyId}?tab=intern`);
}


// 企業を削除（論理削除）
export async function deleteCompany(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  await prisma.company.updateMany({ where: { id, userId }, data: { deletedAt: new Date() } });
  redirect(`/?undo=company&undoId=${id}`);
}

// 企業を元に戻す
export async function restoreCompany(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  await prisma.company.updateMany({ where: { id, userId }, data: { deletedAt: null } });
  redirect("/");
}

// ESを削除
export async function deleteEntrySheet(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);
  await prisma.entrySheet.update({ where: { id }, data: { deletedAt: new Date() } });
  redirect(`/companies/${companyId}?tab=es&undo=entrySheet&undoId=${id}`);
}

// ESを元に戻す
export async function restoreEntrySheet(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const es = await prisma.entrySheet.findUnique({ where: { id }, include: { company: true } });
  if (!es || es.company.userId !== userId) throw new Error("権限がありません");
  await prisma.entrySheet.update({ where: { id }, data: { deletedAt: null } });
  redirect(`/companies/${es.companyId}?tab=es`);
}

// 面接記録を削除
export async function deleteInterview(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);
  await prisma.interview.update({ where: { id }, data: { deletedAt: new Date() } });
  redirect(`/companies/${companyId}?tab=interview&undo=interview&undoId=${id}`);
}

// 面接記録を元に戻す
export async function restoreInterview(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const iv = await prisma.interview.findUnique({ where: { id }, include: { company: true } });
  if (!iv || iv.company.userId !== userId) throw new Error("権限がありません");
  await prisma.interview.update({ where: { id }, data: { deletedAt: null } });
  redirect(`/companies/${iv.companyId}?tab=interview`);
}

// 企業メモを削除（内容が空になった時に自動で呼ばれる）
export async function deleteMemoEntry(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);
  await prisma.memoEntry.update({ where: { id }, data: { deletedAt: new Date() } });
  redirect(`/companies/${companyId}?tab=memo&undo=memoEntry&undoId=${id}`);
}

// 企業メモを元に戻す
export async function restoreMemoEntry(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const entry = await prisma.memoEntry.findUnique({ where: { id }, include: { company: true } });
  if (!entry || entry.company.userId !== userId) throw new Error("権限がありません");
  await prisma.memoEntry.update({ where: { id }, data: { deletedAt: null } });
  redirect(`/companies/${entry.companyId}?tab=memo`);
}

// インターンメモを削除（内容が空になった時に自動で呼ばれる）
export async function deleteInternNote(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const companyId = Number(formData.get("companyId"));
  await assertOwnsCompany(companyId, userId);
  await prisma.internNote.update({ where: { id }, data: { deletedAt: new Date() } });
  redirect(`/companies/${companyId}?tab=intern&undo=internNote&undoId=${id}`);
}

// インターンメモを元に戻す
export async function restoreInternNote(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const note = await prisma.internNote.findUnique({ where: { id }, include: { company: true } });
  if (!note || note.company.userId !== userId) throw new Error("権限がありません");
  await prisma.internNote.update({ where: { id }, data: { deletedAt: null } });
  redirect(`/companies/${note.companyId}?tab=intern`);
}