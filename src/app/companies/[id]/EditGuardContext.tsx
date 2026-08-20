"use client";

import { createContext, useContext, useRef, useState } from "react";

type SaveFn = () => Promise<void> | void;

const EditGuardContext = createContext<{
  markEditing: (id: string, editing: boolean) => void;
  registerReminderSave: (id: string, saveFn: SaveFn | null) => void;
  saveAllReminders: () => Promise<void>;
  isLocked: () => boolean;
  requestSaveHint: () => void;
  hintActive: boolean;
} | null>(null);

export function EditGuardProvider({ children }: { children: React.ReactNode }) {
  const editingIds = useRef<Set<string>>(new Set());
  const reminderSaves = useRef<Map<string, SaveFn>>(new Map());
  const [hintActive, setHintActive] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markEditing = (id: string, editing: boolean) => {
    if (editing) editingIds.current.add(id);
    else editingIds.current.delete(id);
  };

  const registerReminderSave = (id: string, saveFn: SaveFn | null) => {
    if (saveFn) reminderSaves.current.set(id, saveFn);
    else reminderSaves.current.delete(id);
  };

  const saveAllReminders = async () => {
    const saves = Array.from(reminderSaves.current.values());
    reminderSaves.current.clear();
    await Promise.all(saves.map((fn) => fn()));
  };

  const isLocked = () => editingIds.current.size > 0;

  // 他を触ろうとした時に呼ぶ。今開いているフォームの吹き出しを2秒だけ出す
  const requestSaveHint = () => {
    setHintActive(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHintActive(false), 2000);
  };

  return (
    <EditGuardContext.Provider
      value={{ markEditing, registerReminderSave, saveAllReminders, isLocked, requestSaveHint, hintActive }}
    >
      {children}
    </EditGuardContext.Provider>
  );
}

export function useEditGuard() {
  const ctx = useContext(EditGuardContext);
  if (!ctx) throw new Error("useEditGuard must be used within EditGuardProvider");
  return ctx;
}