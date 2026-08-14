import InterviewCard from "./InterviewCard";
import AddInterviewForm from "./AddInterviewForm";

type Interview = { id: number; question: string; answer: string | null; memo: string | null };

export default function InterviewTab({
  companyId,
  interviews,
  createInterview,
  updateInterview,
  deleteInterview,
}: {
  companyId: number;
  interviews: Interview[];
  createInterview: (formData: FormData) => void;
  updateInterview: (formData: FormData) => void;
  deleteInterview: (formData: FormData) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {interviews.map((iv) => (
          <InterviewCard
            key={iv.id}
            interview={iv}
            companyId={companyId}
            updateInterview={updateInterview}
            deleteInterview={deleteInterview}
          />
        ))}
        {interviews.length === 0 && <p className="text-sm text-gray-400">まだ面接記録がありません</p>}
      </div>
      <AddInterviewForm companyId={companyId} createInterview={createInterview} />
    </div>
  );
}