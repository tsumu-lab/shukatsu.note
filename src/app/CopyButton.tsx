"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

// クリックした値をコピーする専用の部品。押すと1.5秒だけチェックマークになる
export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} aria-label="コピー" className="text-gray-400 hover:text-gray-700">
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}