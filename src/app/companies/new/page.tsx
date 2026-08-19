import { createCompany } from "@/app/actions";
import BackButton from "@/app/companies/[id]/BackButton";
import Link from "next/link";

export default function NewCompany() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-company-bg)" }}>
      <main className="max-w-md mx-auto p-6">
        <Link href="/" className="text-sm" style={{ color: "var(--color-accent)" }}>
          ← 戻る
        </Link>
        <h1 className="text-xl font-bold mt-2 mb-6 font-heading">企業を追加</h1>
        <form action={createCompany} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>企業名</label>
            <input name="name" required className="w-full rounded px-3 py-2 border-none focus:outline-none" style={{ backgroundColor: "var(--color-surface)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>マイページURL</label>
            <input name="mypageUrl" type="url" className="w-full rounded px-3 py-2 border-none focus:outline-none" style={{ backgroundColor: "var(--color-surface)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--color-taupe)" }}>マイページID</label>
            <input name="mypageId" className="w-full rounded px-3 py-2 border-none focus:outline-none" style={{ backgroundColor: "var(--color-surface)" }} />
          </div>
          <button type="submit" className="w-full text-white py-2 rounded" style={{ backgroundColor: "var(--color-accent)" }}>
            追加する
          </button>
        </form>
      </main>
    </div>
  );
}