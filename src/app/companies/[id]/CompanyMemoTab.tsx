import MemoEntryCard from "./MemoEntryCard";
import AddMemoEntryForm from "./AddMemoEntryForm";

type MemoEntry = { id: number; content: string };

export default function CompanyMemoTab({
  companyId,
  memoEntries,
  createMemoEntry,
  updateMemoEntry,
  deleteMemoEntry,
}: {
  companyId: number;
  memoEntries: MemoEntry[];
  createMemoEntry: (formData: FormData) => void;
  updateMemoEntry: (formData: FormData) => void;
  deleteMemoEntry: (formData: FormData) => void;
}) {
  return (
    <div className="space-y-3">
      {memoEntries.map((entry) => (
        <MemoEntryCard
          key={entry.id}
          entry={entry}
          companyId={companyId}
          updateMemoEntry={updateMemoEntry}
          deleteMemoEntry={deleteMemoEntry}
        />
      ))}
      
      <AddMemoEntryForm companyId={companyId} createMemoEntry={createMemoEntry} />
    </div>
  );
}