import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  photos: Record<string, string>;
  onClose: () => void;
};

// 1枚あたりの表示時間（ミリ秒）。小さくするほど速くなる
const FRAME_MS = 250;

export default function SlideshowScreen({ photos, onClose }: Props) {
  // 日付の古い順に並べる
  const dates = Object.keys(photos).sort();
  const [index, setIndex] = useState(0);

  // 一定時間ごとに次の写真へ進む（最後まで行ったら最初に戻る）
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % dates.length);
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [dates.length]);

  const date = dates[index];
  if (!date) {
    return <View style={styles.container} />;
  }
  const [y, m, d] = date.split('-');

  return (
    <View style={styles.container}>
      <Image source={{ uri: photos[date] }} style={styles.photo} resizeMode="contain" />
      <View style={styles.top}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.topText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topText}>{y}年{Number(m)}月{Number(d)}日</Text>
        <Text style={styles.topText}>{index + 1}/{dates.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  photo: { flex: 1 },
  top: { position: 'absolute', top: 60, left: 24, right: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});
