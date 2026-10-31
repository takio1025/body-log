import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCalendarDays, toDateKey } from '../calendar';

type Props = {
  photos: Record<string, string>;
  onSelectDate: (dateKey: string) => void;
  onSlideshow: () => void;
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarScreen({ photos, onSelectDate, onSlideshow }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = getCalendarDays(year, month);
  const todayKey = toDateKey(today);
  const photoCount = Object.keys(photos).length;

  // 前の月・次の月へ移動する
  const moveMonth = (diff: number) => {
    const d = new Date(year, month + diff, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => moveMonth(-1)}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{year}年{month + 1}月</Text>
        <TouchableOpacity onPress={() => moveMonth(1)}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={[styles.cell, styles.weekday]}>{w}</Text>
        ))}
        {days.map((date, i) => {
          if (!date) {
            return <View key={`empty-${i}`} style={styles.cell} />;
          }
          const key = toDateKey(date);
          const photo = photos[key];
          const isFuture = key > todayKey;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.cell, key === todayKey && styles.today]}
              disabled={isFuture}
              onPress={() => onSelectDate(key)}
            >
              {photo && <Image source={{ uri: photo }} style={styles.thumb} />}
              <Text style={[styles.day, isFuture && styles.future]}>{date.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, photoCount < 2 && styles.buttonDisabled]}
          disabled={photoCount < 2}
          onPress={onSlideshow}
        >
          <Text style={styles.buttonText}>スライドショー</Text>
        </TouchableOpacity>
        {photoCount < 2 && <Text style={styles.note}>写真が2枚以上になると再生できます</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingTop: 80, paddingHorizontal: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  arrow: { fontSize: 36, color: '#FF5A1F', paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 64, alignItems: 'center', justifyContent: 'center' },
  weekday: { height: 32, color: '#A0A0A0', textAlign: 'center' },
  today: { borderWidth: 1, borderColor: '#FF5A1F', borderRadius: 8 },
  thumb: { position: 'absolute', top: 2, bottom: 2, left: 2, right: 2, borderRadius: 6, opacity: 0.6 },
  day: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  future: { color: '#444' },
  footer: { marginTop: 'auto', marginBottom: 48, alignItems: 'center' },
  button: { width: '100%', height: 56, borderRadius: 12, backgroundColor: '#FF5A1F', alignItems: 'center', justifyContent: 'center' },
  buttonDisabled: { backgroundColor: '#333' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  note: { marginTop: 8, fontSize: 13, color: '#A0A0A0' },
});
