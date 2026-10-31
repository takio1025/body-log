import { dateKeyFromFileName, getCalendarDays, makePhotoFileName, toDateKey } from './calendar';

test('日付を年-月-日の文字列にできる', () => {
  expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
});

test('2026年10月のカレンダーは木曜始まりで31日まである', () => {
  const days = getCalendarDays(2026, 9);
  expect(days.slice(0, 4)).toEqual([null, null, null, null]);
  expect(days[4]?.getDate()).toBe(1);
  expect(days.length).toBe(4 + 31);
});

test('写真のファイル名から日付を取り出せる', () => {
  const name = makePhotoFileName('2026-10-31', 123);
  expect(name).toBe('2026-10-31_123.jpg');
  expect(dateKeyFromFileName(name)).toBe('2026-10-31');
  expect(dateKeyFromFileName('memo.txt')).toBeNull();
});
