import InterviewCard from "./InterviewCard";
import AddInterviewForm from "./AddInterviewForm";

type Interview = { id: number; question: string; answer: string | null; memo: string | null; pinned: boolean  };

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
      <div className="space-y-3">
        {interviews.map((iv) => (
          <InterviewCard
            key={iv.id}
            interview={iv}
            companyId={companyId}
            updateInterview={updateInterview}
            deleteInterview={deleteInterview}
          />
        ))}
      <AddInterviewForm companyId={companyId} createInterview={createInterview} />
    </div>
  );
}