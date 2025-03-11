import { Stack } from 'expo-router';

export default function DreamArchiveLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Header'ı tamamen gizliyoruz
      }}
    />
  );
}