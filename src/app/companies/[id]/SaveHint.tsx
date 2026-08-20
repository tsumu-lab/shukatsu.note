"use client";

export default function SaveHint({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute -top-11 left-0 z-20" style={{ animation: "sh-pop 0.15s ease" }}>
      <div
        className="text-xs rounded-lg px-3 py-2 shadow-md whitespace-nowrap"
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-rust)",
        }}
      >
        ここを保存してください
      </div>
      <div
        className="w-3 h-3 rotate-45 ml-3"
        style={{
          marginTop: "-7px",
          backgroundColor: "var(--color-surface)",
          borderRight: "1px solid var(--color-rust)",
          borderBottom: "1px solid var(--color-rust)",
        }}
      />
    </div>
  );
}