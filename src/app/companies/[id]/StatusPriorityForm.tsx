"use client";

export default function StatusPriorityForm({
  companyId,
  status,
  priority,
  updateStatus,
}: {
  companyId: number;
  status: string;
  priority: number;
  updateStatus: (formData: FormData) => void;
}) {
  return (
    <form action={updateStatus} className="flex gap-3 items-end">
      <input type="hidden" name="id" value={companyId} />
      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>状況</label>
        <select
          name="status"
          defaultValue={status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="border-none rounded px-2 py-1"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <option>検討中</option>
          <option>ES提出済み</option>
          <option>一次面接</option>
          <option>二次面接</option>
          <option>最終面接</option>
          <option>内定</option>
          <option>不合格</option>
          <option>辞退</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>優先度</label>
        <select
          name="priority"
          defaultValue={priority}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="border-none rounded px-2 py-1"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </form>
  );
}