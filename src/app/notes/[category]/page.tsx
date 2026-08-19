import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { createNote, updateNote } from "@/app/actions";
import NoteCard from "../NoteCard";
import AddNoteForm from "../AddNoteForm";
import Link from "next/link";
import { notFound } from "next/navigation";

// カテゴリの内部名 → 画面に出す日本語名
const CATEGORY_LABELS: Record<string, string> = {
  self_pr: "自己PR・ガクチカ",
  interview: "面接",
  gd: "グループディスカッション",
};

export default async function NotesByCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!CATEGORY_LABELS[category]) notFound(); // 想定外のURLなら404

  const userId = await requireUserId();
  const notes = await prisma.personalNote.findMany({
    where: { userId, category }, // ★このカテゴリの分だけ取得
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm text-blue-600 underline">
        ← 戻る
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{CATEGORY_LABELS[category]}</h1>

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
    </main>
  );
}