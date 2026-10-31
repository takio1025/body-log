// 日付を「2026-10-31」のような文字列にする
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// カレンダーに並べる日付の一覧を作る（日曜始まり）
// 月の初日より前の空きマスは null にする
export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

// 写真のファイル名を作る（例: 2026-10-31_1793437169086.jpg）
// 撮り直したときに古い画像が表示されないよう、撮影時刻を付ける
export function makePhotoFileName(dateKey: string, time: number): string {
  return `${dateKey}_${time}.jpg`;
}

// ファイル名から日付を取り出す。写真のファイル名でなければ null
export function dateKeyFromFileName(name: string): string | null {
  const match = name.match(/^(\d{4}-\d{2}-\d{2})_\d+\.jpg$/);
  return match ? match[1] : null;
}
