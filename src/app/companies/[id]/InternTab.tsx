import InternNoteCard from "./InternNoteCard";
import AddInternNoteForm from "./AddInternNoteForm";

type InternNote = { id: number; content: string; pinned: boolean };

export default function InternTab({
  companyId,
  internNotes,
  createInternNote,
  updateInternNote,
  deleteInternNote,
}: {
  companyId: number;
  internNotes: InternNote[];
  createInternNote: (formData: FormData) => void;
  updateInternNote: (formData: FormData) => void;
  deleteInternNote: (formData: FormData) => void;
}) {
  return (
    <div className="space-y-3">
      {internNotes.map((n) => (
        <InternNoteCard
          key={n.id}
          note={n}
          companyId={companyId}
          updateInternNote={updateInternNote}
          deleteInternNote={deleteInternNote}
        />
      ))}

      <AddInternNoteForm companyId={companyId} createInternNote={createInternNote} />
    </div>
  );
}