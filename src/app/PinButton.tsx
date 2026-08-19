"use client";

import { Pin } from "lucide-react";

export default function PinButton({
  pinned,
  formData,
  action,
  size = 14,
  className = "",
}: {
  pinned: boolean;
  formData: Record<string, string | number>;
  action: (formData: FormData) => void;
  size?: number;
  className?: string;
}) {
  return (
    <form action={action} className={className}>
      {Object.entries(formData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <input type="hidden" name="pinned" value={(!pinned).toString()} />
      <button
        type="submit"
        aria-label={pinned ? "ピン留めを外す" : "ピン留めする"}
        style={{ color: pinned ? "var(--color-accent)" : "var(--color-taupe)" }}
      >
        <Pin size={size} fill={pinned ? "currentColor" : "none"} />
      </button>
    </form>
  );
}