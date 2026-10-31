import { useState } from 'react';
import { listPhotos, savePhoto } from './src/photos';
import CalendarScreen from './src/screens/CalendarScreen';
import CameraScreen from './src/screens/CameraScreen';
import SlideshowScreen from './src/screens/SlideshowScreen';

type Screen = { name: 'calendar' } | { name: 'camera'; dateKey: string } | { name: 'slideshow' };

export default function App() {
  // 今どの画面を表示するか
  const [screen, setScreen] = useState<Screen>({ name: 'calendar' });
  // 保存してある写真（例: { '2026-10-31': '写真の場所' }）。起動時に読み込む
  const [photos, setPhotos] = useState<Record<string, string>>(() => listPhotos());

  // 写真を撮ったら保存して、カレンダーに戻る
  const handleTaken = (dateKey: string, tempUri: string) => {
    savePhoto(tempUri, dateKey);
    setPhotos(listPhotos());
    setScreen({ name: 'calendar' });
  };

  if (screen.name === 'camera') {
    const { dateKey } = screen;
    return (
      <CameraScreen
        dateKey={dateKey}
        onTaken={(uri) => handleTaken(dateKey, uri)}
        onCancel={() => setScreen({ name: 'calendar' })}
      />
    );
  }

  if (screen.name === 'slideshow') {
    return <SlideshowScreen photos={photos} onClose={() => setScreen({ name: 'calendar' })} />;
  }

  return (
    <CalendarScreen
      photos={photos}
      onSelectDate={(dateKey) => setScreen({ name: 'camera', dateKey })}
      onSlideshow={() => setScreen({ name: 'slideshow' })}
    />
  );
}
