import { createCompany } from "@/app/actions";
import Link from "next/link";

export default function NewCompany() {
  return (
    <main className="max-w-md mx-auto p-6">
      <Link href="/" className="text-sm text-blue-600 underline">
        ← 戻る
      </Link>
      <h1 className="text-xl font-bold mt-2 mb-6">企業を追加</h1>
      <form action={createCompany} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">企業名</label>
          <input name="name" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">マイページURL</label>
          <input name="mypageUrl" type="url" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">マイページID</label>
          <input name="mypageId" className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          追加する
        </button>
      </form>
    </main>
  );
}