import { Stack } from 'expo-router';
import { View } from 'react-native';
import CustomNavigationBar from '../_components/navigation/CustomNavigationBar';
import { theme } from '../theme';
import { memo } from 'react';

// Navigasyon barını memo ile saralım, gereksiz render'ları önleyelim
const MemoizedNavigationBar = memo(CustomNavigationBar);

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          contentStyle: {
            backgroundColor: theme.colors.background,
            paddingBottom: 60, // Navigasyon çubuğu için alan bırakma
          },
        }}
      >
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="dream" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ href: null }} />
      </Stack>
      
      <MemoizedNavigationBar />
    </View>
  );
}
