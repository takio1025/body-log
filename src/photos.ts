import { Directory, File, Paths } from 'expo-file-system';
import { dateKeyFromFileName, makePhotoFileName } from './calendar';

// 写真を保存するフォルダ（アプリ専用の場所）
const photoDir = new Directory(Paths.document, 'photos');

function ensureDir() {
  if (!photoDir.exists) {
    photoDir.create();
  }
}

// 保存してある写真を { '2026-10-31': '写真の場所', ... } の形で返す
export function listPhotos(): Record<string, string> {
  ensureDir();
  const photos: Record<string, string> = {};
  for (const item of photoDir.list()) {
    if (item instanceof File) {
      const dateKey = dateKeyFromFileName(item.name);
      if (dateKey) {
        photos[dateKey] = item.uri;
      }
    }
  }
  return photos;
}

// 撮った写真を、その日付の写真として保存する（同じ日の古い写真は消す）
export function savePhoto(tempUri: string, dateKey: string): void {
  ensureDir();
  for (const item of photoDir.list()) {
    if (item instanceof File && dateKeyFromFileName(item.name) === dateKey) {
      item.delete();
    }
  }
  const tempFile = new File(tempUri);
  tempFile.move(new File(photoDir, makePhotoFileName(dateKey, Date.now())));
}
