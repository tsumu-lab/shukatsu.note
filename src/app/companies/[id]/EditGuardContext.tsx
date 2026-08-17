"use client";

import { createContext, useContext, useRef } from "react";

// 「今、保存されていない編集中のカードがあるか」をアプリの複数の場所で共有するための仕組み
const EditGuardContext = createContext<{
  markEditing: (id: string, editing: boolean) => void;
  confirmLeave: () => boolean;
} | null>(null);

export function EditGuardProvider({ children }: { children: React.ReactNode }) {
  // Setを使って、複数のカードが同時に編集中でも正しく管理する
  const editingIds = useRef<Set<string>>(new Set());

  const markEditing = (id: string, editing: boolean) => {
    if (editing) editingIds.current.add(id);
    else editingIds.current.delete(id);
  };

  // 移動しようとした時に呼ぶ。編集中が無ければtrue(そのまま移動してOK)、
  // あれば確認を出し、OKなら移動を許可(true)、キャンセルなら移動を止める(false)
  const confirmLeave = () => {
    if (editingIds.current.size === 0) return true;
    return confirm("保存されていない変更があります。保存せずに移動しますか？");
  };

  return (
    <EditGuardContext.Provider value={{ markEditing, confirmLeave }}>
      {children}
    </EditGuardContext.Provider>
  );
}

export function useEditGuard() {
  const ctx = useContext(EditGuardContext);
  if (!ctx) throw new Error("useEditGuard must be used within EditGuardProvider");
  return ctx;
}