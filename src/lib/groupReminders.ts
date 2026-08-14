// リマインダーを「今日」「明日」「日付ごと」「未設定」の
// グループに分ける処理だけを担当する関数（画面の見た目とは無関係）

type ReminderWithCompany = {
  id: number;
  title: string;
  dueDate: Date | null;
  memo: string | null; // ★追加
  companyId: number | null; // ★変更：nullもあり得る
  company: { id: number; name: string } | null; // ★変更：nullもあり得る
};

export type ReminderGroup = {
  label: string;
  items: ReminderWithCompany[];
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function groupReminders(reminders: ReminderWithCompany[]): ReminderGroup[] {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const dated = reminders
    .filter((r) => r.dueDate !== null)
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());
  const noDate = reminders.filter((r) => r.dueDate === null);

  // 同じ日付のものをまとめる
  const dateMap = new Map<string, ReminderWithCompany[]>();
  for (const r of dated) {
    const key = r.dueDate!.toDateString();
    if (!dateMap.has(key)) dateMap.set(key, []);
    dateMap.get(key)!.push(r);
  }

  const groups: ReminderGroup[] = [];
  for (const items of dateMap.values()) {
    const date = items[0].dueDate!;
    const label = isSameDay(date, today)
      ? "今日"
      : isSameDay(date, tomorrow)
      ? "明日"
      : `${date.getMonth() + 1}月${date.getDate()}日(${WEEKDAYS[date.getDay()]})`;
    groups.push({ label, items });
  }

  // 締切未設定は一番下に固定
  if (noDate.length > 0) {
    groups.push({ label: "日時設定なし", items: noDate });
  }

  return groups;
}