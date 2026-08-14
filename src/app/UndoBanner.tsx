"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function UndoBanner({
  actions,
}: {
  actions: Record<string, (formData: FormData) => void>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const undoType = searchParams.get("undo");
  const undoId = searchParams.get("undoId");
  const action = undoType ? actions[undoType] : undefined;

  if (!undoType || !undoId || !action) return null;

  const dismiss = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("undo");
    params.delete("undoId");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white text-sm rounded px-4 py-2 mb-4">
      <span>削除しました</span>
      <div className="flex items-center gap-3">
        <form action={action}>
          <input type="hidden" name="id" value={undoId} />
          <button type="submit" className="underline">元に戻す</button>
        </form>
        <button onClick={dismiss} aria-label="閉じる" className="text-gray-300 hover:text-white">
          ×
        </button>
      </div>
    </div>
  );
}