import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import {
  createNote,
  updateNote,
  createPersonalMemo,
  updatePersonalMemo,
  deletePersonalMemo,
} from "@/app/actions";
import NoteCard from "../NoteCard";
import AddNoteForm from "../AddNoteForm";
import PersonalMemoCard from "../PersonalMemoCard";
import AddPersonalMemoForm from "../AddPersonalMemoForm";
import Link from "next/link";
import { notFound } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  self_pr: "自己PR・ガクチカ",
  interview: "面接",
  gd: "グループディスカッション",
  memo: "メモ", // ★追加
};

export default async function NotesByCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!CATEGORY_LABELS[category]) notFound();

  const userId = await requireUserId();
  const notes = await prisma.personalNote.findMany({
    where: { userId, category, deletedAt: null },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm" style={{ color: "var(--color-accent)" }}>
        ← 戻る
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6 font-heading">{CATEGORY_LABELS[category]}</h1>

      {category === "memo" ? (
        // ★企業メモと同じ「タイトルなし・自由記述の積み重ね」形式
        <div className="space-y-3">
          {notes.map((note) => (
            <PersonalMemoCard
              key={`${note.id}-${note.updatedAt.getTime()}`}
              note={note}
              updatePersonalMemo={updatePersonalMemo}
              deletePersonalMemo={deletePersonalMemo}
            />
          ))}
          <AddPersonalMemoForm createPersonalMemo={createPersonalMemo} />
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {notes.map((note) => (
              <NoteCard
                key={`${note.id}-${note.updatedAt.getTime()}`}
                note={note}
                category={category}
                updateNote={updateNote}
              />
            ))}
          </div>
          <AddNoteForm category={category} createNote={createNote} />
        </>
      )}
    </main>
  );
}