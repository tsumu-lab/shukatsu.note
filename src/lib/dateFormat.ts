// Dateを <input type="datetime-local"> 用の "YYYY-MM-DDTHH:mm" に変換
// (ブラウザの標準変換(toISOString)はUTC基準になり時刻がズレるため、自前で計算)
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 表示用。時刻が00:00(未設定扱い)なら日付だけ、時刻があれば「日付 時:分」
export function formatReminderDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = date.toLocaleDateString("ja-JP");
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  return hasTime ? `${dateStr} ${pad(date.getHours())}:${pad(date.getMinutes())}` : dateStr;
}