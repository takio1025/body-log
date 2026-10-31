import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  dateKey: string;
  onTaken: (tempUri: string) => void;
  onCancel: () => void;
};

export default function CameraScreen({ dateKey, onTaken, onCancel }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [, m, d] = dateKey.split('-');

  // カメラの許可を確認中
  if (!permission) {
    return <View style={styles.container} />;
  }

  // カメラの許可がまだない場合
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.message}>写真を撮るために、カメラの使用を許可してください</Text>
        <TouchableOpacity style={styles.allow} onPress={requestPermission}>
          <Text style={styles.allowText}>カメラを許可する</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // シャッターを押したとき
  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      onTaken(photo.uri);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

      {/* 毎日同じ位置・大きさで撮るためのガイド枠（点線） */}
      <View style={styles.guideArea} pointerEvents="none">
        <View style={styles.head} />
        <View style={styles.body} />
      </View>

      <View style={styles.top}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.topText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topText}>{Number(m)}月{Number(d)}日</Text>
        <TouchableOpacity onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}>
          <Text style={styles.topText}>⟲</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>点線の枠に頭と肩を合わせてください</Text>

      <TouchableOpacity style={styles.shutter} onPress={takePhoto} disabled={busy}>
        <View style={styles.shutterInner} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  message: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 24 },
  allow: { backgroundColor: '#FF5A1F', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 16 },
  allowText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cancelText: { fontSize: 16, color: '#A0A0A0' },
  guideArea: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  head: { width: 120, height: 150, borderRadius: 75, borderWidth: 2, borderColor: '#fff', borderStyle: 'dashed' },
  body: {
    width: 300, height: 260, marginTop: 8, borderWidth: 2, borderColor: '#fff', borderStyle: 'dashed',
    borderTopLeftRadius: 120, borderTopRightRadius: 120,
  },
  top: { position: 'absolute', top: 60, left: 24, right: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topText: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  hint: { position: 'absolute', bottom: 150, alignSelf: 'center', color: '#fff', fontSize: 14 },
  shutter: {
    position: 'absolute', bottom: 50, alignSelf: 'center', width: 76, height: 76, borderRadius: 38,
    borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FF5A1F' },
});
